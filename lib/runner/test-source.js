const path = require('path');
const fs = require('fs');
const minimatch = require('minimatch');
const Utils = require('../utils');
const Concurrency = require('./concurrency');
const {Logger, validExtensions, jsFileExt, singleSourceFile} = Utils;
const {getTestSourceForRerunFailed} = require('./rerunUtil');

class TestSource {
  static get GroupNameDelimiter() {
    return ',';
  }

  constructor(settings, argv = {}) {
    this.argv = argv;
    this.settings = settings;
    this.src_folders = settings.src_folders || [];
  }

  getTestSourceForSingle(targetPath) {
    let testsource;

    if (Array.isArray(targetPath)) {
      targetPath = targetPath[0];
    }

    if (targetPath && path.resolve(targetPath) === targetPath) {
      testsource = targetPath;
    } else {
      testsource = path.join(process.cwd(), targetPath);
    }

    const fileExt = path.parse(testsource).ext;

    if (!validExtensions.includes(fileExt)) {
      const fileExists = fs.existsSync(testsource);
      if (fileExists) {
        const err = new Error(`Cannot load file ${testsource}`);
        err.detailedErr = `Files with ${fileExt} extension are not supported by Nightwatch.`;
        err.showTrace = false;

        throw err;
      }

      testsource += jsFileExt;
    }

    return testsource;
  }

  /**
   * Returns the path where the tests are located
   * @returns {*}
   */
  getSource() {
    const {test_runner} = this.settings;

    if ((process.env.NIGHTWATCH_RERUN_FAILED === 'true' || this.argv['rerun-failed']) && Concurrency.isMasterProcess() && test_runner?.type !== 'cucumber') {
      return getTestSourceForRerunFailed(this.settings);
    }

    if (this.src_folders.length === 0 && test_runner?.src_folders && test_runner?.type === 'cucumber') {
      this.src_folders = test_runner?.src_folders;
    }
    
    if (this.argv['test-worker'] || singleSourceFile(this.argv)) {
      return this.getTestSourceForSingle(this.argv.test || this.argv._source);
    }

    if (this.argv.testcase) {
      this.argv.testcase = null;

      Logger.warn('Option --testcase used without --test is ignored.');
    }

    if (Array.isArray(this.argv._source) && (this.argv._source.length > 0)) {
      return this.argv._source;
    }

    if (this.argv.group) {
      // add support for multiple groups
      if (Utils.isString(this.argv.group)) {
        this.argv.group = this.argv.group.split(TestSource.GroupNameDelimiter);
      }

      const groupTestsource = this.findGroupPathMultiple(this.argv.group);

      // If a group does not exist in the multiple src folder case, it is removed
      // from the test path list.
      if (this.src_folders.length === 1) {
        return groupTestsource;
      }
      // only when all groups fail to match will there be a run error
      const testsource = groupTestsource.filter(Utils.dirExistsSync);

      if (!this.settings.silent) {
        const ignoredSource = groupTestsource.filter(entry => testsource.indexOf(entry) === -1);

        if (ignoredSource.length) {
          Logger.warn('The following group paths were not found and will be excluded from the run:\n - ' +
            ignoredSource.join('\n - '));
        }
      }

      return testsource;
    }

    this.applySrcFilters();

    return this.src_folders;
  }

  /**
   * Apply "exclude" patterns on src_folders, in case more than one was specified
   */
  applySrcFilters() {
    if (this.src_folders.length < 2) {
      return this;
    }

    if (this.settings.exclude) {
      const arrExclude = Array.isArray(this.settings.exclude) ? this.settings.exclude : [this.settings.exclude];
      const resolvedExclude = arrExclude.map(item => path.resolve(item));

      this.src_folders = this.src_folders.filter(item => {
        const resolvedPath = path.resolve(item);
        let match = true;

        resolvedExclude.forEach(function(pattern) {
          match = !resolvedPath.includes(pattern) && !minimatch(resolvedPath, pattern);
        });

        return match;
      });
    }
  }

  /**
   * Gets test paths from each of the src folders for a single group.
   *
   * @param {string} groupName
   * @return {Array}
   */
  findGroupPath(groupName) {
    const fullGroupPath = path.resolve(groupName);

    // for each src folder, append the group to the path
    // to resolve the full test path

    return this.src_folders.map(function(srcFolder) {
      const fullSrcFolder = path.resolve(srcFolder);
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
