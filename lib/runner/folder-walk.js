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

          return Utils.checkPath(fullPath);
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

        return Walk.walkFolder(fullPath, this.settings);
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

  static walkFolder(folderPath, settings) {
    let results = [];
    // FIXME: support for multiple folders
    return new Promise(function walk(resolve, reject) {
      fs.readdir(folderPath, function(err, list) {
        if (err) {
          return reject(err);
        }

        let pending = list.length;

        if (pending === 0) {
          return resolve(results);
        }

        list.forEach(function(resource) {
          resource = path.join(folderPath, resource);

          fs.stat(resource, function(err, stat) {
            if (err || !stat) {
              return;
            }

            if (stat.isDirectory()) {
              let dirName = resource.split(path.sep).slice(-1)[0];
              let isExcluded = FilenameMatcher.isFolderExcluded(resource, settings); // prevent loading of files from an excluded folder
              let isSkipped = settings.skipgroup && settings.skipgroup.indexOf(dirName) > -1;

              if (isExcluded || isSkipped) {
                pending = pending-1;
              } else {
                Walk.walkFolder(resource, settings)
                  .then(function(data) {
                    results = results.concat(data);
                    pending = pending-1;

                    if (!pending) {
                      resolve(results);
                    }
                  })
                  .catch(function(err) {
                    reject(err);
                  });
              }
            } else {
              if (stat.isFile() && Utils.isFileNameValid(resource)) {
                results.push(resource);
              }

              pending = pending-1;

              if (!pending) {
                resolve(results);
              }
            }
          });
        });
      });
    });
  }
}

module.exports = Walk;