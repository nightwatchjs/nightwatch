/**
 * https://svn.jenkins-ci.org/trunk/hudson/dtkit/dtkit-format/dtkit-junit-model/src/main/resources/com/thalesgroup/dtkit/junit/model/xsd/junit-4.xsd
 */

const fs = require('fs');
const stripAnsi = require('strip-ansi');
const mkpath = require('mkpath');
const path = require('path');
const ejs = require('ejs');
const Utils = require('../../utils');
const {Logger} = Utils;

let __tmplData__ = '';

class JUnitReporter {
  constructor(results, opts = {}) {
    this.results = results;
    this.options = opts;
  }

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

  static createReportFolder(output_folder) {
    return new Promise((resolve, reject) => {
      mkpath(output_folder, function (err) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
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
    return (shouldCreateFolder ?
      JUnitReporter.createReportFolder(output_folder) :
      Promise.resolve()
    ).then(() => {
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

  writeReport(moduleKey, data) {
    let module = this.results.modules[moduleKey];
    let pathParts = moduleKey.split(path.sep);
    let moduleName = pathParts.pop();
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
        Logger.info(`Wrote report file to: ${filename}.`);
      });
  }

  write() {
    let keys = Object.keys(this.results.modules);

    return JUnitReporter.loadTemplate()
      .then(data => {
        let promises = keys.map(moduleKey => {
          return this.writeReport(moduleKey, data);
        });

        return Promise.all(promises);
      });
  }
}

module.exports = (function() {

  return {
    write(results, options, callback) {
      let reporter = new JUnitReporter(results, options);

      reporter.write()
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
