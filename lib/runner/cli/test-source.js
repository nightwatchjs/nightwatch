const path = require('path');
const Utils = require('../../util/utils.js');
const Concurrency = require('../concurrency/concurrency.js');
const Logger = require('../../util/logger.js');

class TestSource {
  static get defaultFileExt() {
    return '.js';
  }

  constructor(src_folders, argv = {}) {
    this.argv = argv;
    this.src_folders = src_folders;
  }

  singleTestRun() {
    return typeof this.argv.test == 'string';
  }

  isTestWorker() {
    return Concurrency.isParallelMode() && this.argv['test-worker'];
  }

  singleSourceFile() {
    if (this.singleTestRun()) {
      return Utils.fileExistsSync(this.argv.test);
    }

    return (Array.isArray(this.argv._source) && this.argv._source.length == 1) && Utils.fileExistsSync(this.argv._source[0]);
  }

  getTestSourceForSingle(targetPath) {
    let testsource;

    if (targetPath && path.resolve(targetPath) === targetPath) {
      testsource = targetPath;
    } else {
      testsource = path.join(process.cwd(), targetPath);
    }

    if (testsource.substr(-3) !== TestSource.defaultFileExt) {
      testsource += TestSource.defaultFileExt;
    }

    return testsource;
  }

  /**
   * Returns the path where the tests are located
   * @returns {*}
   */
  getTestSource() {
    let testsource;

    if (this.isTestWorker() || this.singleSourceFile()) {
      testsource = this.getTestSourceForSingle(this.argv.test || this.argv._source[0]);
    } else {
      if (this.argv.testcase) {
        this.argv.testcase = null;

        Logger.warn('Option --testcase used without --test is ignored.');
      }

      if (Array.isArray(this.argv._source) && (this.argv._source.length > 0)) {
        testsource = this.argv._source;
      } else if (this.argv.group) {

        // add support for multiple groups
        if (typeof this.argv.group == 'string') {
          this.argv.group = this.argv.group.split(',');
        }

        const groupTestsource = this.findGroupPathMultiple(this.argv.group);

        // If a group does not exist in the multiple src folder case, it is removed
        // from the test path list.
        if (this.src_folders.length === 1) {
          testsource = groupTestsource;
        } else {
          // only when all groups fail to match will there be a run error
          testsource = groupTestsource.filter(Utils.dirExistsSync);

          if (this.argv.verbose) {
            let ignoredSource = groupTestsource.filter(function(path) {
              return testsource.indexOf(path) === -1;
            });

            if (ignoredSource.length) {
              Logger.warn('The following group paths were not found and will be excluded from the run:\n - ' + ignoredSource.join('\n - '));
            }
          }
        }
      } else {
        testsource = this.src_folders;
      }
    }

    return testsource;
  }

  /**
   * Gets test paths from each of the src folders for a single group.
   *
   * @param {string} groupName
   * @return {Array}
   */
  findGroupPath(groupName) {
    let fullGroupPath = path.resolve(groupName);

    // for each src folder, append the group to the path
    // to resolve the full test path

    return this.src_folders.map(function(srcFolder) {
      let fullSrcFolder = path.resolve(srcFolder);
      if (fullGroupPath.indexOf(fullSrcFolder) === 0) {
        return groupName;
      }

      return path.join(srcFolder, groupName);
    });
  }

  /**
   * Gets test paths for tests from any number of groups.
   *
   * @param {Array} groups
   */
  findGroupPathMultiple(groups) {
    let paths = [];

    groups.forEach(groupName => {
      paths = paths.concat(this.findGroupPath(groupName));
    });

    return paths;
  }
}

module.exports = TestSource;