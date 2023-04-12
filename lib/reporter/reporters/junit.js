/**
 * https://svn.jenkins-ci.org/trunk/hudson/dtkit/dtkit-format/dtkit-junit-model/src/main/resources/com/thalesgroup/dtkit/junit/model/xsd/junit-4.xsd
 */

const fs = require('fs');
const stripAnsi = require('strip-ansi');
const path = require('path');
const ejs = require('ejs');
const Utils = require('../../utils');
const BaseReporter = require('../base-reporter.js');
const {Logger} = Utils;

let __tmplData__ = '';

class JUnitReporter extends BaseReporter {
  static get templateFile() {
    return path.join(__dirname, 'junit.xml.ejs');
  }

  static set tmplData(val) {
    __tmplData__ = val;
  }

  static get tmplData() {
    return __tmplData__;
  }

  static loadTemplate() {
    return new Promise((resolve, reject) => {
      if (JUnitReporter.tmplData) {
        return resolve(JUnitReporter.tmplData);
      }

      fs.readFile(JUnitReporter.templateFile, (err, data) => {
        if (err) {
          return reject(err);
        }

        JUnitReporter.tmplData = data.toString();
        resolve(JUnitReporter.tmplData);
      });
    });
  }

  writeReport(moduleKey, data) {
    const module = this.results.modules[moduleKey];
    const pathParts = moduleKey.split(path.sep);
    const moduleName = pathParts.pop();
    let className = moduleName;
    let output_folder = this.options.output_folder;
    let shouldCreateFolder = false;

    this.adaptAssertions(module);

    if (pathParts.length) {
      output_folder = path.join(output_folder, pathParts.join(path.sep));
      className = pathParts.join('.') + '.' + moduleName;
      shouldCreateFolder = true;
    }

    const filename = path.join(output_folder, `${module.reportPrefix}${moduleName}.xml`);
    const report = {
      module,
      moduleName,
      className,
      systemerr: this.results.errmessages.map(item => stripAnsi(item)).join('\n')
    };

    let rendered = ejs.render(data, report);
    rendered = Utils.stripControlChars(rendered);

    return this.writeReportFile(filename, rendered, shouldCreateFolder, output_folder)
      .then(_ => {
        Logger.info(Logger.colors.stack_trace(`Wrote XML report file to: ${path.resolve(filename)}`));
      });
  }

  write() {
    const keys = Object.keys(this.results.modules);

    return JUnitReporter.loadTemplate()
      .then(data => {
        const promises = keys.map(moduleKey => {
          return this.writeReport(moduleKey, data);
        });

        return Promise.all(promises);
      });
  }
}

module.exports = (function() {
  return {
    write(results, options, callback) {

      const envs = Object.keys(results.modulesWithEnv);
      const promises = envs.map(env => {
        const envResult = {...results, modules: results.modulesWithEnv[env]};
        const reporter = new JUnitReporter(envResult, options);

        return reporter.write();
      });

      Promise.all(promises)
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
