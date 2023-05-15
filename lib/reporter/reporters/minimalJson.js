const lodashPick = require('lodash.pick');
const path = require('path');
const Utils = require('../../utils');
const {Logger} = Utils;
const BaseReporter = require('../base-reporter.js');

class MinimalJsonReporter extends BaseReporter {

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
    const filename = path.join(output_folder, 'minimal_report.json');
    const shouldCreateFolder = !Utils.dirExistsSync(output_folder);

    const report = {
      modules: results
    };

    return this.writeReportFile(filename, JSON.stringify(report), shouldCreateFolder, output_folder)
      .then(_ => {
        Logger.info(Logger.colors.stack_trace(`Wrote Rerun Json report file to: ${path.resolve(filename)}`));

        // Setting env varaible with minimalJsonReporter path.
        // Next time user runs nightwatch with rerun functionality, json reporter can be read from this
        process.env.NIGHTWATCH_RERUN_REPORT_FILE = filename;
        process.env.NEW_FOO = filename;
      });
  }
}

function write(results, options, callback) {
  const reporter = new MinimalJsonReporter(results, options);

  reporter.writeReport()
    .then(_ => {
      callback();
    })
    .catch(err => {
      Logger.error(err);
      callback(err);
    });
}

module.exports = {
  MinimalJsonReporter,
  write
};
