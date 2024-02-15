const path = require('path');
const Convert = require('ansi-to-html');
const stripAnsi = require('strip-ansi');

const Concurrency = require('../runner/concurrency');
const DefaultSettings = require('../settings/defaults.js');
const Utils = require('../utils');
const {Logger, isFunction} = Utils;
const Results = require('./results.js');
const AxeReport = require('./axe-report.js');
const Summary = require('./summary.js');
const PluginLoader = require('../api/_loaders/plugin.js');

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
      errorsPerTest: {},
      modules: {},
      modulesWithEnv: {},
      elapsedTime: 0,
      startTimestamp: null,
      endTimestamp: null
    };
  }

  constructor(reporter = DefaultSettings.default_reporter, settings, {openReport = false, reportFileName = null} = {}) {
    this.suiteResults = [];
    this.skippedSuites = 0;
    this.uncaughtErr = null;
    this.reportFileName = reportFileName;

    this.reporterFile = [];
    if (Array.isArray(reporter)) {
      // Any subsequent changes in `this.reporterFile` shouldn't lead to changes in
      // `argv.reporter` provided by the user, or `DefaultSettings.default_reporter`.
      this.reporterFile = reporter.slice(0);
    } else if (typeof reporter == 'string') {
      this.reporterFile = reporter.split(',');
    }
    this.settings = settings;
    this.summary = new Summary(settings);
    this.openReport = openReport;
    this.ansiConverter = new Convert();
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

  addTestSuiteResults(testResults, httpOutput) {
    testResults = testResults || {};
    const loggerOutput = httpOutput || Logger.collectOutput();
    testResults.httpOutput = loggerOutput.map(item => {
      return [item[0], this.ansiConverter.toHtml(item[1]),
        (item[2] ? this.ansiConverter.toHtml(item[2]) : '')];
    });

    testResults.rawHttpOutput = loggerOutput.map(item => {
      return [item[0], stripAnsi(item[1] || '').replace(/&#39;/g, '\''),
        (item[2] ? stripAnsi(item[2]) : '').replace(/&#39;/g, '\'')];
    });
    this.suiteResults.push(testResults);

    return this;
  }

  setupChildProcessListener(emitter) {
    if (!Concurrency.isTestWorker()) {
      emitter.on('message', data => {
        data = this.settings.use_child_process ? JSON.parse(data) : data;
        this.addTestSuiteResults(data.results, data.httpOutput);
      });
    }
  }

  create(startTime) {
    const initialReport = GlobalReporter.initialReport;

    if (this.uncaughtErr) {
      initialReport.errors++;
      const errorMessage = Logger.getErrorContent(this.uncaughtErr);
      initialReport.errmessages.push(errorMessage);
    }

    const endTime = new Date().getTime();
    this.elapsedTime = endTime - startTime;

    this.globalResults = Results.createGlobalReport(this.suiteResults, initialReport);
    this.globalResults.elapsedTime = (this.elapsedTime / 1000).toPrecision(4);
    this.globalResults.startTimestamp = new Date(startTime).toUTCString();
    this.globalResults.endTimestamp = new Date(endTime).toUTCString();

    return this;
  }

  print() {
    if (Concurrency.isWorker() || !this.settings.output) {
      return this;
    }

    if (this.hasTestFailures()) {
      const countMessage = this.getTestsFailedMessage();

      const {columns = 100} = process.stdout;
      // eslint-disable-next-line no-console
      console.log(colors.light_red('\n' + new Array(Math.max(100, columns - 20)).join('─')));

      // eslint-disable-next-line no-console
      console.log(`\n  ️${colors.light_red('TEST FAILURE')} ${colors.stack_trace('(' + Utils.formatElapsedTime(this.elapsedTime) + ')')}${colors.light_red(':')} ${countMessage}\n`);

      this.summary.print(this.globalResults);
      // eslint-disable-next-line no-console
      console.log('');
    } else {
      if (!this.shouldShowSummary()) {
        return;
      }

      const message = this.getTestsPassedMessage();
      // eslint-disable-next-line no-console
      console.log(`\n${message} ${colors.stack_trace('(' + Utils.formatElapsedTime(this.elapsedTime) + ')')}`);
    }

    this.printA11yReport();

    return this;
  }

  loadReporter() {
    const allAvailableReporters = this.reporterFile.slice(0);

    return Promise.all(allAvailableReporters.map((reporter) => this.loadFile(reporter)));
  }

  printA11yReport() {
    Object.keys(this.globalResults.modules).forEach(testSuite => {
      Object.keys(this.globalResults.modules[testSuite].completed).forEach(key => {
        const testcase = this.globalResults.modules[testSuite].completed[key];

        if (testcase.a11y) {
          const a11yReport = new AxeReport(testcase.a11y);

          if (testcase.a11y.verbose || a11yReport.hasViolations()) {
            // eslint-disable-next-line no-console
            console.log('\n' + Logger.colors.green(`Accessibility report for: ${testcase.a11y.component}`));
          }

          if (testcase.a11y.verbose) {
            a11yReport.printPasses(key);
          }

          if (a11yReport.hasViolations()) {
            a11yReport.printViolations(testcase.a11y.component);
          }
        }
      });
    });
  }

  async loadFile(reporterFile) {
    const builtInReporterFileName = path.join(__dirname, 'reporters', reporterFile + '.js');
    const fileExists = await Utils.fileExists(builtInReporterFileName);

    if (!fileExists) {
      return this.loadCustomReporter(reporterFile);
    }

    return require(builtInReporterFileName);
  }

  async loadCustomReporter(reporterFile) {
    let customReporterModuleExists;
    let reporter;

    try {
      reporter = require(reporterFile);
      customReporterModuleExists = true;
    } catch (err) {
      customReporterModuleExists = false;
    }

    const customReporterExists = await Utils.fileExists(reporterFile);

    if (!customReporterExists && !customReporterModuleExists) {
      throw new Error(`The custom reporter "${reporterFile}" cannot be resolved.`);
    }

    if (!customReporterModuleExists) {
      reporter = require(path.resolve(reporterFile));
    }

    if (Utils.isFunction(reporter.write)) {
      return reporter;
    }

    throw new Error(`The custom reporter "${reporterFile}" must have a public ".write(results, options, [callback])" method defined which should return a Promise.`);
  }

  async writeReportToFile(globalResults) {
    if (this.isDisabled()) {
      return;
    }

    try {
      await Utils.createFolder(this.settings.output_folder);
      const reporters = await this.loadReporter();

      return Promise.all(
        reporters.map(reporterFile => this.writeReport(reporterFile, globalResults))
      );
    } catch (err) {
      const error = new Error('An error occurred while trying to save the report file');
      error.detailedErr = err.message;

      throw error;
    }
  }

  async writeReport(reporter, globalResults) {
    const {globals, output_folder, start_session, folder_format, reporter_options: {filename_format}} = this.settings;
    const needsCallback = reporter.write.length === 3;
    const options = {
      filename_prefix: this.settings.report_prefix,
      report_filename: this.reportFileName,
      output_folder,
      globals,
      start_session,
      reporter,
      openReport: this.openReport,
      filename_format,
      folder_format
    };

    if (needsCallback) {
      // backwards compatibility
      return new Promise((resolve, reject) => {
        reporter.write(globalResults, options, function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }

    return await reporter.write(globalResults, options);
  }

  shouldShowSummary() {
    const modules = Object.keys(this.globalResults.modules);
    if (modules.length > 1) {
      return true;
    }

    if (modules.length <= 0) {
      return false;
    }

    return Object.keys(this.globalResults.modules[modules[0]].completed).length > 1;
  }

  hasAssertionCount() {
    const testsCounts = this.getTotalTestsCount();

    return !this.settings.unit_tests_mode && testsCounts > 0 && this.globalResults.assertions > 0;
  }

  getTotalTestsCount() {
    return Object.keys(this.globalResults.modules)
      .reduce((count, moduleKey) => {
        const module = this.globalResults.modules[moduleKey];

        return count + module.tests;
      }, 0);
  }

  getTestsFailedMessage() {
    const hasCount = this.hasAssertionCount();
    const totalTests = this.getTotalTestsCount();

    let errorsMsg = '';
    const failedMsg = hasCount ? 'assertions' : 'tests';
    let passedMsg = colors.green(this.globalResults.passed) + ' passed'; // assertions passed

    const skippedSuitesCount = this.skippedSuites > 0 ? `\n   - ${colors.light_red(this.skippedSuites)} other test suites were aborted; ` : '';

    if (!hasCount) {
      const passedCount = Math.max(0, totalTests - this.globalResults.failed - this.globalResults.errors); // testcases passed
      passedMsg = '\n   - ' + colors.green(passedCount + '/' + (totalTests > 0 ? totalTests : 'NA')) + ' tests passed';
    }

    let skipped = '';
    if (this.globalResults.skipped) {
      skipped = `\n   - ${colors.cyan(this.globalResults.skipped)} skipped`;
    }

    const globalErrors = this.globalResults.errors;
    if (globalErrors) {
      const suffix = globalErrors > 1 ? 's' : '';
      errorsMsg += `\n   - ${colors.red(globalErrors)} error${suffix} during execution;`;
    }

    const failedCountMsg = `\n   - ${colors.red(this.globalResults.failed)} ${failedMsg} failed;`;

    return `${errorsMsg} ${skippedSuitesCount}${failedCountMsg} ${passedMsg}${skipped}`;
  }

  getTestsPassedMessage() {
    const hasCount = this.hasAssertionCount();
    let message;
    let count;

    if (hasCount) {
      count = this.globalResults.passed;
      message = colors.green(`  ✨ PASSED. ${count} ${count > 1 ? 'total assertions' : ' assertion'}`);
    } else {
      count = this.getTotalTestsCount();
      message = `${colors.green('  ✨ PASSED. ' + count)} tests`;
    }

    return message;
  }

  getPluginReporters() {
    const plugins = this.settings.plugins || [];

    const reporters = plugins.reduce((prev, pluginName) => {
      const plugin = PluginLoader.load(pluginName);
      if (isFunction(plugin.instance?.reporter)) {
        prev.push(plugin.instance);
      } else if (plugin.globals?.reporter && isFunction(plugin.globals.reporter)) {
        prev.push({
          reporter: plugin.globals.reporter,
          settings: plugin.globals.settings || {}
        });
      }

      return prev;
    }, []);

    return reporters;
  }

  getTimeoutValueMs(customReporter) {
    // global timeout for all custom reporters – set by user
    if (this.settings.custom_reporter_timeout) {
      return this.settings.custom_reporter_timeout;
    }

    // timeout for a specific custom reporter – set by plugin
    if (customReporter.settings?.timeoutMs) {
      return customReporter.settings.timeoutMs;
    }

    // default timeout when nothing is set – set by nightwatch
    return this.settings.globals.customReporterCallbackTimeout;
  }

  callReporterFn(reporter, globalResults, {callbackTimeoutId, resolve, reject}) {
    try {
      if (reporter.length === 2) {
        const reporterFnAsync = Utils.makeFnAsync(2, reporter, this.settings.globals);
        reporterFnAsync.call(this.settings.globals, globalResults, function () {
          clearTimeout(callbackTimeoutId);
          resolve();
        });
      } else {
        const promise = reporter.call(this.settings.globals, globalResults);

        if (promise instanceof Promise) {
          promise
            .then(() => {
              clearTimeout(callbackTimeoutId);
              resolve();
            })
            .catch(err => {
              clearTimeout(callbackTimeoutId);
              reject(err);
            });
        } else {
          clearTimeout(callbackTimeoutId);
          resolve();
        }
      }
    } catch (err) {
      clearTimeout(callbackTimeoutId);
      reject(err);
    }
  }

  runCustomGlobalReporter(globalResults) {
    const pluginReporters = this.getPluginReporters();
    let customReporters;

    if (Utils.isFunction(this.settings.globals.reporter))  {
      customReporters = [{
        reporter: this.settings.globals.reporter,
        settings: {
          timeoutMs: this.settings.globals.customReporterCallbackTimeout
        }
      }];
    } else if (Array.isArray(this.settings.globals.reporter)) {
      customReporters = this.settings.globals.reporter.map(reporter => {
        if (Utils.isFunction(reporter)) {
          return {
            reporter,
            settings: {
              timeoutMs: this.settings.globals.customReporterCallbackTimeout
            }
          };
        }

        return reporter;
      });
    }

    customReporters = customReporters.concat(pluginReporters);

    const results = customReporters.map(customReporter => {
      return new Promise((resolve, reject) => {
        const callbackTimeoutId = setTimeout(() => {
          const reporterName = customReporter.reporterName ? `"${customReporter.reporterName}" ` :  '';

          const error = new Error(`Timeout while waiting for the custom reporter ${reporterName}to finish.`);
          error.help = [
            'Make sure the custom reporter calls the "done" callback when finished.',
            'If the reporter is async, make sure the async operation is completed before the timeout is reached.',
            'You can extend the timeout by defining the "custom_reporter_timeout" config setting in your nightwatch config file.'
          ];
          error.link = 'See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-reporters.html for more details.';

          reject(error);
        }, this.getTimeoutValueMs(customReporter));

        const {reporter} = customReporter;
        this.callReporterFn(reporter, globalResults, {callbackTimeoutId, resolve, reject});
      });
    });

    return Promise.all(results);
  }

  save() {
    if (Concurrency.isWorker()) {
      return Promise.resolve();
    }

    return Promise.all([
      this.runCustomGlobalReporter(this.globalResults),
      this.writeReportToFile(this.globalResults)
    ]);
  }
};
