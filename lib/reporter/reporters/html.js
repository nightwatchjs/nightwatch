const fs = require('fs');
const fse = require('fs-extra');
const open = require('open');
const path = require('path');
const ejs = require('ejs');

const Utils = require('../../utils');
const BaseReporter = require('../base-reporter.js');
const {Logger} = Utils;

let __tmplData__ = '';

class HtmlReporter extends BaseReporter {
  static get templateFile() {
    return path.join(__dirname, './html/index.html.ejs');
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

  async writeReportFile(filename, rendered, output_folder, assetFolder) {
    await fse.copy(assetFolder, output_folder);

    return new Promise((resolve, reject) => {
      fs.writeFile(filename, rendered, function(err) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });

  }

  openReporter(fileName) {
    return open(fileName)
      .catch(err => {
        Logger.error('Error opening the report: ', err.message);
      });
  }

  async writeReport(data) {
    const results = this.results;
    const {modules}  = results;
    const output_folder = this.options.output_folder;
    const shouldOpenReport = this.options.openReport;

    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      this.adaptAssertions(module);
    });

    results.modules = Object.keys(results.modules).reduce((prev, value) => {
      results.modules[value].modulePath = results.modules[value].modulePath.replace(process.cwd(), '');
      prev[value] = results.modules[value];

      return prev;
    }, {});

    const destFolder = path.join(output_folder, 'nightwatch-html-report');
    await Utils.createFolder(destFolder);

    const filename = path.join(destFolder, 'index.html');
    const sourceHtmlFolder = path.join(__dirname, './html');
    const sourceAssetsFolder = path.join(__dirname, './html/assets');

    let rendered = ejs.render(data, results, {
      views: [sourceHtmlFolder]
    });
    rendered = Utils.stripControlChars(rendered);

    return this.writeReportFile(filename, rendered, destFolder, sourceAssetsFolder)
      .then(_ => {
        Logger.logDetailedMessage(Logger.colors.stack_trace(`Wrote HTML report file to: ${path.resolve(filename)}` + '\n'), 'info');

        if (shouldOpenReport) {
          return this.openReporter(filename);
        }
      });
  }

  write() {
    return HtmlReporter.loadTemplate()
      .then(data => this.writeReport(data));
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
