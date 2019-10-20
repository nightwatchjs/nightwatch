/**
 * https://svn.jenkins-ci.org/trunk/hudson/dtkit/dtkit-format/dtkit-junit-model/src/main/resources/com/thalesgroup/dtkit/junit/model/xsd/junit-4.xsd
 * @type {exports}
 */
const fs = require('fs');
const mkpath = require('mkpath');
const path = require('path');
const ejs = require('ejs');
const Utils = require('../../util/utils.js');
const Logger = require('../../util/logger.js');

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
    Object.keys(module.completed).forEach(function(item) {
      let testcase = module.completed[item];
      let assertions = testcase.assertions;

      for (let i = 0; i < assertions.length; i++) {
        if (assertions[i].stackTrace) {
          assertions[i].stackTrace = Utils.stackTraceFilter(assertions[i].stackTrace.split('\n'));
        }
      }

      if (testcase.failed > 0 && testcase.stackTrace) {
        let stackParts = testcase.stackTrace.split('\n');
        let errorMessage = stackParts.shift();
        testcase.stackTrace = Utils.stackTraceFilter(stackParts);
        testcase.message = errorMessage;
      }
    });
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

    let filename = path.join(output_folder, `${module.reportPrefix}${moduleName}.xml`);
    let rendered = ejs.render(data, {
      module: module,
      moduleName: moduleName,
      className: className,
      systemerr: this.results.errmessages.join('\n')
    });

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
