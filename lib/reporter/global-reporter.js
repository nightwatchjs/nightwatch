const path = require('path');
const DefaultSettings = require('../settings/defaults.js');
const Utils = require('../utils');
const Results = require('./results.js');
const Summary = require('./summary.js');
const {Logger} = Utils;
const colors = Logger.colors;

module.exports = class GlobalReporter {
  static get initialReport() {
    return {
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      tests: 0,
      assertions: 0,
      errmessages: [],
      modules: {}
    };
  }

  constructor(reporter = DefaultSettings.default_reporter, settings) {
    this.suiteResults = [];
    this.uncaughtErr = null;
    this.reporterFile = reporter;
    this.settings = settings;
    this.summary = new Summary(settings);
  }

  registerUncaughtErr(err) {
    this.uncaughtErr = err;
  }

  isDisabled() {
    return this.settings.output_folder === false;
  }

  hasTestFailures() {
    return this.uncaughtErr || this.suiteResults.some(item => {
      return item.hasFailures;
    });
  }

  addTestSuiteResults(testResults) {
    this.suiteResults.push(testResults);

    return this;
  }

  setupChildProcessListener(emitter) {
    const Concurrency = require('../runner/concurrency/concurrency.js');

    if (Concurrency.isMasterProcess()) {
      emitter.on('message', data => {
        data = JSON.parse(data);
        this.addTestSuiteResults(data.results);
      });
    }
  }

  create(startTime) {
    const initialReport = GlobalReporter.initialReport;

    if (this.uncaughtErr) {
      initialReport.errors++;
      let errorMessage = Utils.errorToStackTrace(this.uncaughtErr);
      initialReport.errmessages.push(errorMessage);
    }

    this.elapsedTime = new Date().getTime() - startTime;
    this.globalResults = Results.createGlobalReport(this.suiteResults, initialReport);

    return this;
  }

  print() {
    const Concurrency = require('../runner/concurrency/concurrency.js');

    if (Concurrency.isChildProcess() || !this.settings.output) {
      return this;
    }

    if (this.hasTestFailures()) {
      let countMessage = this.getTestsFailedMessage();

      console.log(colors.light_red('_________________________________________________'));
      console.log(`\n${colors.light_red('TEST FAILURE:')} ${countMessage} ${colors.stack_trace('(' + Utils.formatElapsedTime(this.elapsedTime) + ')')}`);

      this.summary.print(this.globalResults);
      console.log('');
    } else {
      if (!this.shouldShowSummary()) {
        return;
      }

      let message = this.getTestsPassedMessage();
      console.log(`\n${message} ${colors.stack_trace('(' + Utils.formatElapsedTime(this.elapsedTime) + ')')}`);
    }

    return this;
  }

  loadFile() {
    const builtInReporterFileName = path.join(__dirname, 'reporters', this.reporterFile + '.js');

    return Utils
      .fileExists(builtInReporterFileName)
      .then(fileExists => {
        if (!fileExists) {
          return this.loadCustomReporter();
        }

        return require(builtInReporterFileName);
      });
  }

  loadCustomReporter() {
    return Utils.fileExists(this.reporterFile)
      .then(customReporterExists => {
        if (!customReporterExists) {
          throw new Error(`The custom reporter file name "${this.reporterFile}" cannot be resolved.`);
        }

        const reporter = require(path.resolve(this.reporterFile));
        if (Utils.isFunction(reporter.write)) {
          return reporter;
        }

        throw new Error('The reporter module must have a public ".write()" method defined.');
      });
  }

  async writeReportToFile(globalResults) {
    if (this.isDisabled()) {
      return;
    }

    try {
      await Utils.createFolder(this.settings.output_folder);
      const reporter = await this.loadFile();

      return new Promise((resolve, reject) => {
        const {globals, output_folder, start_session} = this.settings;

        reporter.write(globalResults, {
          filename_prefix: this.settings.report_prefix,
          output_folder,
          globals,
          start_session,
          reporter: this.reporterFile,

        }, function(err) {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    } catch (err) {
      throw new Error(`An error occurred while trying to save the report file:\n${err.stack}.\n`);
    }
  }

  shouldShowSummary() {
    let modules = Object.keys(this.globalResults.modules);
    if (modules.length > 1) {
      return true;
    }

    if (modules.length <= 0) {
      return false;
    }

    return Object.keys(this.globalResults.modules[modules[0]].completed).length > 1;
  }

  hasAssertionCount() {
    let testsCounts = this.getTotalTestsCount();

    return !this.settings.unit_tests_mode && testsCounts > 0 && this.globalResults.assertions > 0;
  }

  getTotalTestsCount() {
    return Object.keys(this.globalResults.modules)
      .reduce((count, moduleKey) => {
        let module = this.globalResults.modules[moduleKey];

        return count + module.tests;
      }, 0);
  }

  getTestsFailedMessage() {
    let hasCount = this.hasAssertionCount();

    let errorsMsg = '';
    let failedMsg = hasCount ? 'assertions' : 'tests';
    let passedMsg = colors.green(this.globalResults.passed) + ' passed'; // assertions passed

    if (!hasCount) {
      let passedCount = Math.max(0, this.getTotalTestsCount() - this.globalResults.failed - this.globalResults.errors); // testcases passed
      passedMsg = colors.green(passedCount) + ' passed';
    }

    let skipped = '';
    if (this.globalResults.skipped) {
      skipped = ` and ${colors.cyan(this.globalResults.skipped)} skipped`;
    }

    let globalErrors = this.globalResults.errors;
    if (globalErrors) {
      let suffix = globalErrors > 1 ? 's' : '';
      errorsMsg += `${colors.red(globalErrors)} error${suffix} during execution;`;
    }

    return `${errorsMsg} ${colors.red(this.globalResults.failed)} ${failedMsg} failed, ${passedMsg}${skipped}`;
  }

  getTestsPassedMessage() {
    let hasCount = this.hasAssertionCount();
    let message;
    let count;

    if (hasCount) {
      count = this.globalResults.passed;
      message = colors.green(`OK. ${count} ${count > 1 ? ' total assertions' : ' assertion'} passed`);
    } else {
      count = this.getTotalTestsCount();
      message = `${colors.green('OK. ' + count)} tests passed`;
    }

    return message;
  }

  runCustomGlobalReporter(globalResults) {
    let customReporter = this.settings.globals.reporter;

    return new Promise((resolve, reject) => {
      let callbackTimeoutId = setTimeout(() => {
        reject(new Error('Timeout while waiting (20s) for the custom global reporter callback to be called.'));
      }, this.settings.globals.customReporterCallbackTimeout);

      try {
        let reporterFnAsync = Utils.makeFnAsync(2, customReporter, this.settings.globals);
        reporterFnAsync.call(this.settings.globals, globalResults, function() {
          clearTimeout(callbackTimeoutId);
          resolve();
        });
      } catch (err) {
        clearTimeout(callbackTimeoutId);
        reject(err);
      }
    });
  }

  save() {
    return Promise.all([
      this.runCustomGlobalReporter(this.globalResults),
      this.writeReportToFile(this.globalResults)
    ]);
  }
};

