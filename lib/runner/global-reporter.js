const path = require('path');
const mkpath = require('mkpath');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const Reporter = require('../testsuite/reporter.js');
const colors = Logger.colors;

class GlobalReporter {
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

  static get customReporterCallbackTimeout() {
    return 20000;
  }

  constructor(reporter, settings) {
    this.results = [];
    this.uncaughtErr = null;
    this.reporterFile = reporter;
    this.settings = settings;
  }

  registerUncaughtErr(err) {
    this.uncaughtErr = err;
  }

  isDisabled() {
    return this.settings.output_folder === false;
  }

  hasTestFailures() {
    return this.uncaughtErr || this.results.some(item => {
      return item.hasFailures;
    });
  }

  addTestSuiteResults(testResults) {
    this.results.push(testResults);

    return this;
  }

  setupChildProcessListener(emitter) {
    const Concurrency = require('./concurrency/concurrency.js');

    if (Concurrency.isMasterProcess()) {
      emitter.on('message', data => {
        data = JSON.parse(data);
        this.addTestSuiteResults(data.results);
      });
    }
  }

  create(startTime) {
    let initialReport = GlobalReporter.initialReport;
    if (this.uncaughtErr) {
      initialReport.errors++;
      let errorMessage = Utils.errorToStackTrace(this.uncaughtErr);
      initialReport.errmessages.push(errorMessage);
    }

    this.elapsedTime = new Date().getTime() - startTime;
    this.globalResults = this.results.reduce((prev, item) => {
      let results = item.results;

      prev.passed += results.passedCount;
      prev.failed += results.failedCount;
      prev.errors += results.errorsCount;
      prev.skipped += results.skippedCount;
      prev.assertions += results.assertionsCount;
      if (Array.isArray(item.errmessages) && item.errmessages.length > 0) {
        prev.errmessages = prev.errmessages.concat(item.errmessages);
      }

      prev.modules[item.moduleKey] = {
        skipped: results.skipped,
        reportPrefix: item.reportPrefix,
        time: results.time,
        completed: results.completed,
        errmessages: results.errmessages,
        tests: results.testsCount,
        failures: results.failedCount,
        errors: results.errorsCount,
        group: results.groupName
      };

      return prev;
    }, initialReport);

    return this;
  }

  print() {
    const Concurrency = require('./concurrency/concurrency.js');

    if (Concurrency.isChildProcess()) {
      return this;
    }

    if (this.hasTestFailures()) {
      let countMessage = this.getTestsFailedMessage();

      console.log(colors.light_red('_________________________________________________'));
      console.log(`\n${colors.light_red('TEST FAILURE:')} ${countMessage} ${Utils.formatElapsedTime(this.elapsedTime)}`);

      this.printFailureSummary();
      console.log('');
    } else {
      if (!this.shouldShowSummary()) {
        return;
      }

      let message = this.getTestsPassedMessage();
      console.log(`\n${message} (${Utils.formatElapsedTime(this.elapsedTime)})`);
    }

    return this;
  }

  runCustomGlobalReporter(globalResults) {
    let customReporter = this.settings.globals.reporter;

    return new Promise((resolve, reject) => {
      let callbackTimeoutId = setTimeout(() => {
        reject(new Error('Timeout while waiting (20s) for the custom global reporter callback to be called.'));
      }, GlobalReporter.customReporterCallbackTimeout);

      customReporter(globalResults, () => {
        clearTimeout(callbackTimeoutId);
        resolve();
      });
    });
  }

  createFolder() {
    return new Promise((resolve, reject) => {
      mkpath(this.settings.output_folder, function(err) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  loadFile() {
    let builtInReporterFileName = path.join(__dirname, 'reporters', this.reporterFile + '.js');

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

        try {
          let reporter = require(this.reporterFile);
          if (typeof reporter.write == 'function') {
            return reporter;
          }
        } catch (err) {
          throw err;
        }

        throw new Error('The reporter module must have a public ".write()" method defined.');
      });
  }

  writeReportToFile(globalResults) {
    if (this.isDisabled()) {
      return Promise.resolve();
    }

    return this.createFolder()
      .then(_ => {
        return this.loadFile();
      })
      .then(reporter => {
        return new Promise((resolve, reject) => {
          reporter.write(globalResults, {
            filename_prefix: this.settings.report_prefix,
            output_folder: this.settings.output_folder,
            globals: this.settings.globals,
            reporter: this.reporterFile,
            start_session: this.settings.start_session
          }, function(err) {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      })
      .catch(err => {
        throw new Error(`An error occurred while trying to save the report file:\n${err.stack}.\n`);
      });
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
      let passedCount = Math.max(0, this.getTotalTestsCount() - this.globalResults.failed); // testcases passed
      passedMsg = colors.green(passedCount) + ' passed';
    }

    let skipped = '';
    if (this.globalResults.skipped) {
      skipped = ` and ${colors.cyan(this.globalResults.skipped)} skipped`;
    }

    let globalErrors = this.globalResults.errors;
    if (globalErrors) {
      let suffix = globalErrors > 1 ? 's' : '';
      errorsMsg += `${colors.red(globalErrors)} error${suffix} during execution`;
    }

    return `${errorsMsg} ${colors.red(this.globalResults.failed)} ${failedMsg} failed, ${passedMsg}${skipped}.`;
  }

  getTestsPassedMessage() {
    let hasCount = this.hasAssertionCount();
    let message;
    let count;

    if (hasCount) {
      count = this.globalResults.passed;
      message = colors.green(`OK. ${count} ${count > 1 ? ' total assertions' : ' assertion'} passed.`);
    } else {
      count = this.getTotalTestsCount();
      message = `${colors.green('OK. ' + count)} tests passed.`;
    }

    return message;
  }

  printFailureSummary() {
    Object.keys(this.globalResults.modules).forEach(moduleKey => {
      let testSuite = this.globalResults.modules[moduleKey];

      if (testSuite.failures > 0 || testSuite.errors > 0) {
        console.log('\n' + colors.red(` ${Utils.symbols.fail} ${moduleKey}`));

        Object.keys(testSuite.completed).forEach(testcaseName => {
          let testcase = testSuite.completed[testcaseName];

          if (testcase.failed > 0 || testcase.errors > 0) {
            let triesCount = testcase.retries > 0 ? testcase.retries + 1 : '';
            let triesContent = testcase.retries > 0 ? ` - ${triesCount} tries` : '';

            console.log(` – ${colors.stack_trace(testcaseName)} ${colors.yellow('(' + Utils.formatElapsedTime(testcase.timeMs) + (triesCount ? ` × ${triesCount}`: '') + ')')}${triesContent}`);

            if (testcase.assertions.length > 0 && this.settings.start_session) {
              Reporter.printAssertions(testcase);
            } else if (testcase.stackTrace) {
              Utils.showStackTrace(testcase.stackTrace);
            }
          }
        });

        if (Array.isArray(testSuite.errmessages)) {
          testSuite.errmessages.forEach(function(errorMessage) {
            console.log('');
            console.error(errorMessage);
            console.log('');
          });
        }

        if (testSuite.skipped.length > 0) {
          console.log(colors.cyan('   SKIPPED:'));
          testSuite.skipped.forEach(function(testcase) {
            console.log(`   - ${testcase}`);
          });
        }
      }
    });

    if (Array.isArray(this.globalResults.errmessages) /*&& Object.keys(this.globalResults.modules).length === 0*/) {
      this.globalResults.errmessages.forEach(function(err) {
        console.log('');
        console.error(err);
        console.log('');
      });
    }
  }

  save() {
    return Promise.all([
      this.runCustomGlobalReporter(this.globalResults),
      this.writeReportToFile(this.globalResults)
    ]);
  }
}

module.exports = GlobalReporter;