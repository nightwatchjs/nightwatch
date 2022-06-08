const fs = require('fs');
const stripAnsi = require('strip-ansi');
const Utils = require('../utils');

module.exports = class BaseReporter {
  constructor(results, opts = {}) {
    this.results = results;
    this.options = opts;
  }

  adaptAssertions(module) {
    module.completed = Object.keys(module.completed).reduce(function(prev, item) {
      if (module.skipped.includes(item)) {
        return prev;
      }

      const testcase = module.completed[item];
      const assertions = testcase.assertions;

      for (let i = 0; i < assertions.length; i++) {
        assertions[i].message = stripAnsi(assertions[i].message);

        if (assertions[i].stackTrace) {
          assertions[i].stackTrace = stripAnsi(assertions[i].stackTrace);
          assertions[i].stackTrace = Utils.stackTraceFilter(assertions[i].stackTrace.split('\n'));
        }
      }

      if (testcase.failed > 0 && assertions.length === 0 && testcase.lastError) {
        const stackParts = testcase.stackTrace.split('\n');
        testcase.stackTrace = Utils.stackTraceFilter(stackParts);
        testcase.message = stripAnsi(testcase.lastError.message);
      }

      prev[item] = testcase;

      return prev;
    }, {});
  }

  writeReportFile(filename, rendered, shouldCreateFolder, output_folder) {
    return (shouldCreateFolder ? Utils.createFolder(output_folder) : Promise.resolve())
      .then(() => {
        return new Promise((resolve, reject) => {
          fs.writeFile(filename, rendered, function(err) {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      });
  }

  /**
   * @override
   */
  async writeReport(moduleKey) {}

  write() {
    const keys = Object.keys(this.results.modules);
    const promises = keys.map(moduleKey => {
      return this.writeReport(moduleKey);
    });

    return Promise.all(promises);
  }
};
