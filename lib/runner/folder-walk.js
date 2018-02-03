const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');
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

  constructor(testSource, settings) {
    if (typeof testSource == 'string') {
      testSource = [testSource];
    }

    this.testSource = testSource;
    this.settings = settings;
    this.fullPaths = null;

    this.results = new Results();

    this.validateSource();
  }

  get promise() {
    return this.__promise;
  }

  validateSource() {
    if (this.testSource.length === 0) {
      throw new Error('No source folder defined. Check configuration.');
    }

    this.fullPaths = this.testSource.map(function (p) {
      return path.resolve(p);
    });
  }

  checkPath(source) {
    return new Promise((resolve, reject) => {
      fs.stat(source, function(err, stat) {
        if (err) {
          return reject(err);
        }

        resolve(stat);
      });
    });
  }

  registerMatchers(sourcePath) {
    if (this.settings.exclude) {
      FilenameMatcher.addMatcher('exclude', sourcePath, this.settings);
    }

    if (this.settings.filter) {
      FilenameMatcher.addMatcher('filter', sourcePath, this.settings);
    }
  }

  /**
   *
   * @param {Array} list
   */
  applyFilters(list) {
    return list.sort().filter(filePath => {
      if (this.settings.exclude && FilenameMatcher.register.exclude.matcher.match(filePath)) {
        return false;
      }

      if (this.settings.filter && !FilenameMatcher.register.filter.matcher.match(filePath)) {
        return false;
      }

      let filename = filePath.split(path.sep).slice(-1)[0];

      if (this.settings.filename_filter) {
        return minimatch(filename, this.settings.filename_filter);
      }

      if (this.settings.tag_filter || this.settings.skiptags) {
        return TagsMatcher.match(filePath, this.settings);
      }

      return true;
    });
  }

  promiseFn(resolve, reject) {
    let sourcePath = this.modulePathsCopy.shift();

    this.checkPath(sourcePath)
      .then(stat => {
        if (stat.isFile()) {
          return sourcePath;
        }

        if (!stat.isDirectory()) {
          return null;
        }

        this.registerMatchers(sourcePath);

        return Walk.walkFolder(sourcePath, this.settings);
      })
      .then(sourcePath => {
        if (Array.isArray(sourcePath)) {
          sourcePath = this.applyFilters(sourcePath);
        }

        if (sourcePath) {
          this.results.register(sourcePath);
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
    this.modulePathsCopy = this.fullPaths.slice(0);

    this.createPromise();

    return this.promise;
  }

  static walkFolder(folderPath, settings) {
    let results = [];

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
            if (stat && stat.isDirectory()) {
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
              results.push(resource);
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