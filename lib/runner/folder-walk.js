const path = require('path');
const minimatch = require('minimatch');
const lodashCloneDeep = require('lodash/cloneDeep');
const Utils = require('../utils');
const FilenameMatcher = require('./matchers/filename.js');
const TagsMatcher = require('./matchers/tags.js');

class Results {
  constructor() {
    this.dataArray = [];
  }

  getData() {
    return this.dataArray;
  }

  register(sourcePath) {
    if (!Array.isArray(sourcePath)) {
      sourcePath = [sourcePath];
    }

    sourcePath.filter(item => {
      return Utils.isFileNameValid(item);
    }).forEach(item => {
      if (this.dataArray.indexOf(item) === -1) {
        this.dataArray.push(item);
      }
    });
  }
}

class Walker {
  constructor(testSource = [], settings, argv = {}) {
    if (Utils.isString(testSource)) {
      testSource = [testSource];
    }

    this.testSource = testSource;
    this.settings = lodashCloneDeep(settings);
    this.argv = argv;
    this.usingMocha = this.settings.test_runner && this.settings.test_runner.type === 'mocha';
    this.usingCucumber = this.settings.test_runner?.type === 'cucumber';

    this.registerMatchers();

    this.results = new Results();
    if (!this.argv['launch-url']) {
      this.validateSource();
    }
  }

  get promise() {
    return this.__promise;
  }

  get disableTs() {
    return this.settings.disable_typescript === true;
  }

  isComponentTestingMode() {
    return this.settings.globals.component_tests_mode;
  }

  validateSource() {
    if (this.testSource.length === 0) {
      const err = new Error('No test source specified, please check "src_folders" config');

      err.showTrace = false;

      if (Array.isArray(this.settings.src_folders) && this.settings.src_folders.length > 0) {
        const srcFolders = this.settings.src_folders.map(item => `"${item}"`).join(', ');
        err.message += `; src_folders: ${srcFolders}`;
      }

      if (this.argv.group) {
        const groups = this.argv.group.map(item => `"${item}"`).join(', ');
        err.message += `; group(s): ${groups}`;
      }

      err.detailedErr = 'Run nightwatch with --help to display usage info.';
      err.message += '.';

      throw err;
    }
  }

  registerMatchers() {
    const {settings, argv} = this;
    this.tags = new TagsMatcher(settings);

    if (settings.exclude) {
      FilenameMatcher.addMatcher(FilenameMatcher.TYPE_EXCLUDE, {settings, argv});
    }

    if (settings.filter) {
      FilenameMatcher.addMatcher(FilenameMatcher.TYPE_FILTER, {settings, argv});
    }
  }

  /**
   * Apply filters on resolved file names
   *
   * @param {Array} list
   */
  applyFilters(list) {
    if (this.usingCucumber) {
      return list;
    }

    return list.sort().filter(filePath => {
      let matched = true;

      if (this.settings.filter && !FilenameMatcher.register.filter.match(filePath)) {
        matched = false;
      }

      if (this.settings.exclude && FilenameMatcher.register.exclude.match(filePath)) {
        matched = false;
      }

      const filename = filePath.split(path.sep).slice(-1)[0];

      if (this.settings.filename_filter) {
        matched = matched && minimatch(filename, this.settings.filename_filter);
      }

      return matched;
    });
  }

  async applyTagFilter(list) {
    if (!Array.isArray(list)) {
      return;
    }

    if (!this.tags.anyTagsDefined() || this.usingCucumber) {
      return list;
    }

    const matches = await Promise.all(list.map(filePath => {
      return this.tags.loadModule(filePath);
    }));

    return matches.filter(context => {
      if (!context) {
        return false;
      }

      return this.tags.checkModuleTags(context);
    }).map(context => context.modulePath);
  }

  promiseFn(resolve, reject) {
    const sourcePath = this.modulePathsCopy.shift();
    let fullPath = path.resolve(sourcePath);

    Utils.checkPath(fullPath)
      .catch(err => {
        if (err.code === 'ENOENT') {
          if (sourcePath.startsWith('examples/')) {
            // try the examples folder
            fullPath = path.join(__dirname, '../../', sourcePath);
          } else {
            fullPath = path.join(Utils.getConfigFolder(this.argv), sourcePath);
          }

          return Utils.checkPath(fullPath, err);
        }

        throw err;
      })
      .then(stat => {
        if (stat && stat.isFile()) {
          return fullPath;
        }

        if (stat && !stat.isDirectory()) {
          return null;
        }

        return this.readFolderDeep(fullPath);
      })
      .then(fullPath => {
        if (fullPath && Utils.isString(fullPath)) {
          fullPath = [fullPath];
        }

        if (Array.isArray(fullPath)) {
          return this.applyFilters(fullPath);
        }
      })
      .then(fullPath => {
        return this.applyTagFilter(fullPath);
      })
      .then(fullPath => {
        if (fullPath) {
          this.results.register(fullPath);
        }

        if (this.modulePathsCopy.length === 0) {
          resolve(this.results.getData());
        } else {
          this.promiseFn(resolve, reject);
        }
      })
      .catch(function(err) {
        reject(err);
      });
  }

  createPromise() {
    this.__promise = new Promise(this.promiseFn.bind(this));

    return this;
  }

  readTestSource() {
    this.modulePathsCopy = this.testSource.slice(0);

    this.createPromise();

    return this.promise;
  }

  readFolderDeep(folderPath) {
    return Utils.readDir(folderPath)
      .then(list => {
        if (list.length === 0) {
          return null;
        }

        const statPromises = list.map(resource => {
          resource = path.isAbsolute(resource) ? resource : path.join(folderPath, resource);

          return Utils.checkPath(resource);
        });

        return Promise.all(statPromises)
          .then(statResults => {
            return statResults.reduce((prev, value, index) => {
              prev.push([list[index], value]);

              return prev;
            }, []);
          });
      })
      .then(promiseResults => {
        if (!promiseResults) {
          return null;
        }

        return Promise.all(promiseResults.map(item => {
          let resource = item[0];
          const stat = item[1];

          if (path.isAbsolute(resource)) {
            folderPath = path.dirname(resource);
            resource = path.basename(resource);
          }

          if (stat && stat.isDirectory()) {
            const dirName = path.basename(resource);
            const isExcluded = FilenameMatcher.isFolderExcluded(resource, this.settings); // prevent loading of files from an excluded folder
            const isSkipped = this.settings.skipgroup && this.settings.skipgroup.indexOf(dirName) > -1;

            if (isExcluded || isSkipped) {
              return null;
            }

            return this.readFolderDeep(path.join(folderPath, resource));
          }

          if (this.disableTs && Utils.isTsFile(resource)) {
            return null;
          }

          if (stat && stat.isFile() && Utils.isFileNameValid(resource)) {
            return path.join(folderPath, resource);
          }

          return null;
        }));
      }).then(results => {
        if (!results) {
          return null;
        }

        return Utils.flattenArrayDeep(results, 3);
      });
  }
}

module.exports = Walker;
