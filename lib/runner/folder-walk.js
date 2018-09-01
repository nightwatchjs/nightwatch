const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');
const Utils = require('../util/utils.js');
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
      return Walk.FILE_EXT_PATTERN.test(item);
    }).forEach(item => {
      if (this.dataArray.indexOf(item) === -1) {
        this.dataArray.push(item);
      }
    });
  }
}

class Walk {
  static get FILE_EXT_PATTERN () {
    return /\.js$/;
  }

  constructor(testSource = [], settings, argv = {}) {
    if (Utils.isString(testSource)) {
      testSource = [testSource];
    }

    this.testSource = testSource;
    this.settings = settings;
    this.argv = argv;

    this.registerMatchers();

    this.results = new Results();

    this.validateSource();
  }

  get promise() {
    return this.__promise;
  }

  validateSource() {
    // TODO: refactor this into TestSource
    if (this.testSource.length === 0) {
      let err = new Error('No test source specified, please check configuration');
      if (Array.isArray(this.settings.src_folders) && this.settings.src_folders.length > 0) {
        let srcFolders = this.settings.src_folders.map(item => `"${item}"`).join(', ');
        err.message += `; src_folders: ${srcFolders}`;
      }

      if (this.argv.group) {
        let groups = this.argv.group.map(item => `"${item}"`).join(', ');
        err.message += `; group(s): ${groups}`;
      }

      err.message += '.';

      throw err;
    }
  }

  registerMatchers() {
    this.tags = new TagsMatcher(this.settings);

    if (this.settings.exclude) {
      FilenameMatcher.addMatcher(FilenameMatcher.TYPE_EXCLUDE, this.settings);
    }

    if (this.settings.filter) {
      FilenameMatcher.addMatcher(FilenameMatcher.TYPE_FILTER, this.settings);
    }
  }

  /**
   * Apply filters on resolved file names
   *
   * @param {Array} list
   */
  applyFilters(list) {
    return list.sort().filter(filePath => {
      let matched = true;

      if (this.settings.filter && !FilenameMatcher.register.filter.match(filePath)) {
        matched = false;
      }

      if (this.settings.exclude && FilenameMatcher.register.exclude.match(filePath)) {
        matched = false;
      }

      let filename = filePath.split(path.sep).slice(-1)[0];

      if (this.settings.filename_filter) {
        matched = minimatch(filename, this.settings.filename_filter);
      }

      if (this.settings.tag_filter || this.settings.skiptags) {
        matched = this.tags.match(filePath);
      }

      return matched;
    });
  }

  promiseFn(resolve, reject) {
    let sourcePath = this.modulePathsCopy.shift();
    let fullPath = path.resolve(sourcePath);

    Utils.checkPath(fullPath)
      .catch(err => {
        if (err.code === 'ENOENT') {
          fullPath = path.join(Utils.getConfigFolder(this.argv), sourcePath);

          return Utils.checkPath(fullPath, err);
        }

        throw err;
      })
      .then(stat => {
        if (stat.isFile()) {
          return fullPath;
        }

        if (!stat.isDirectory()) {
          return null;
        }

        return this.readFolderDeep(fullPath);
      })
      .then(fullPath => {
        if (Array.isArray(fullPath)) {
          fullPath = this.applyFilters(fullPath);
        }

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
          resource = path.join(folderPath, resource);

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
          const resource = item[0];
          const stat = item[1];

          if (stat.isDirectory()) {
            const dirName = path.basename(resource);
            const isExcluded = FilenameMatcher.isFolderExcluded(resource, this.settings); // prevent loading of files from an excluded folder
            const isSkipped = this.settings.skipgroup && this.settings.skipgroup.indexOf(dirName) > -1;

            if (isExcluded || isSkipped) {
              return null;
            }

            return this.readFolderDeep(path.join(folderPath, resource));
          }

          if (stat.isFile() && Utils.isFileNameValid(resource)) {
            return path.join(folderPath, resource);
          }

          return null;
        }));
      }).then(results => {
        return Utils.flattenArrayDeep(results, 3);
      });

  }
}

module.exports = Walk;