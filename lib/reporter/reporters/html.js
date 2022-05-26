const fs = require('fs');
const fse = require('fs-extra');
const open = require('open');
const stripAnsi = require('strip-ansi');
const path = require('path');
const ejs = require('ejs');
const Utils = require('../../utils');
const {Logger} = Utils;

let __tmplData__ = '';

class HtmlReporter {
  constructor(results, opts = {}) {
    this.results = results;
    this.options = opts;
  }

  static get templateFile() {
    return path.join(__dirname, './html/reporter.html.ejs');
  }

  static set tmplData(val) {
    __tmplData__ = val;
  }

  static get tmplData() {
    return __tmplData__;
  }

  static loadTemplate() {
    return new Promise((resolve, reject) => {
      if (HtmlReporter.tmplData) {
        return resolve(HtmlReporter.tmplData);
      }

      fs.readFile(HtmlReporter.templateFile, (err, data) => {
        if (err) {
          return reject(err);
        }

        HtmlReporter.tmplData = data.toString();
        resolve(HtmlReporter.tmplData);
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

  writeReportFile(filename, rendered, shouldCreateFolder, output_folder, assetFolder) {
    return (shouldCreateFolder ? Utils.createFolder(output_folder) : Promise.resolve())
      .then(() => fse.copy(assetFolder, output_folder))
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

  openReporter(fileName) {

    return open(fileName)
      .catch(err => {
        Logger.error('Error opening the report: ', err.message);
      });
  }

  writeReport(results, data) {

    const {modules}  = results;
    const output_folder = this.options.output_folder;
    const shouldCreateFolder = false;
    const shouldOpenReport = this.options.openReport;

    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      this.adaptAssertions(module);
    });
    
    const filename = path.join(output_folder, 'reporter.html');
    const htmlFolder = path.join(__dirname, './html');
    const assetFolder = path.join(__dirname, './html/assets');
    let rendered = ejs.render(data, this.results, {views: [htmlFolder]}); 
    rendered = Utils.stripControlChars(rendered);

    return this.writeReportFile(filename, rendered, shouldCreateFolder, output_folder, assetFolder)
      .then(_ => {
        Logger.info(`Wrote report file to: ${filename}.`);
        
        if (shouldOpenReport) {
          return this.openReporter(filename);
        }
      });
  }

  write() {
    const keys = Object.keys(this.results.modules);

    return HtmlReporter.loadTemplate()
      .then(data => this.writeReport(this.results, data));
  }
}

module.exports = (function() {

  return {
    write(results, options, callback) {
      const reporter = new HtmlReporter(results, options);

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
