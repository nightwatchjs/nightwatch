const stripAnsi = require('strip-ansi');
const path = require('path');
const Utils = require('../../utils');
const {Logger} = Utils;
const BaseReporter = require('../base-reporter.js');

class JsonReporter extends BaseReporter {

  writeReport(moduleKey, data = {}) {
    const module = this.results.modules[moduleKey];
    const pathParts = moduleKey.split(path.sep);
    const moduleName = pathParts.pop();

    let output_folder = this.options.output_folder;
    let shouldCreateFolder = false;

    this.adaptAssertions(module);

    if (pathParts.length) {
      output_folder = path.join(output_folder, pathParts.join(path.sep));
      shouldCreateFolder = true;
    }

    const filename = this.options.report_filename || path.join(output_folder, `${module.reportPrefix}${moduleName}.json`);

    const httpOutput = Logger.getOutput().map(item => {
      return [item[0], stripAnsi(item[1]), item[2] || ''];
    });

    const report = {
      report: module,
      name: moduleName,
      httpOutput,
      systemerr: this.results.errmessages.map(item => stripAnsi(item)).join('\n')
    };

    return this.writeReportFile(filename, JSON.stringify(report), shouldCreateFolder, output_folder)
      .then(_ => {
        Logger.info(Logger.colors.stack_trace(`Wrote JSON report file to: ${path.resolve(filename)}`));
      });
  }
}

module.exports = (function() {
  return {
    write(results, options) {
      const envs = Object.keys(results.modulesWithEnv);
      const promises = envs.map(env => {
        const envResult = {...results, modules: results.modulesWithEnv[env]};
        const reporter = new JsonReporter(envResult, options);

        return reporter.write();
      });

      return Promise.all(promises);
    }
  };
})();
