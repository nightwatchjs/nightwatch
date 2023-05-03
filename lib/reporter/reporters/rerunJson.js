const lodashPick = require('lodash.pick');
const path = require('path');
const Utils = require('../../utils');
const {Logger} = Utils;
const BaseReporter = require('../base-reporter.js');

class RerunJsonReporter extends BaseReporter {

  adaptModule(module) {
    // Pick only the necessary fields
    const result = lodashPick(module, [
      'modulePath',
      'status'
    ]);

    return result;
  }

  adaptResults() {
    const {modules}  = this.results;
    this.modules = {};

    Object.keys(modules).forEach((moduleKey) => {
      this.modules[moduleKey] = this.adaptModule(modules[moduleKey]);
    });

    return this.modules;
  }

  writeReport() {
    const results = this.adaptResults();
    const {output_folder} = this.options;
    const filename = path.join(output_folder, 'test_results.json');
    const shouldCreateFolder = !Utils.dirExistsSync(output_folder);

    const report = {
      modules: results
    };

    return this.writeReportFile(filename, JSON.stringify(report), shouldCreateFolder, output_folder)
      .then(_ => {
        Logger.info(Logger.colors.stack_trace(`Wrote Rerun Json report file to: ${path.resolve(filename)}`));

        // File path pointing to test run status report (test_results.json by default)
        process.env.NIGHTWATCH_RERUN_REPORT_FILE = filename;
      });
  }
}

module.exports = (function() {
  return {
    write(results, options, callback) {

      const reporter = new RerunJsonReporter(results, options);

      reporter.writeReport()
        .then(_ => {
          callback();
        })
        .catch(err => {
          Logger.error(err);
          callback(err);
        });
    }
  };
})();
