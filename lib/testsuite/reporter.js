const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const TestResults = require('./results.js');
const TestCase = require('./testcase.js');
const Context = require('./context.js');
const Screenshots = require('./screenshots.js');

class Reporter {
  /**
   *
   * @param {Array} tests
   * @param {SuiteRetries} suiteRetries
   * @param {Object} settings
   * @param {Object} addOpts
   */
  constructor(tests, suiteRetries, settings, addOpts) {
    this.settings = settings;
    this.suiteRetries = suiteRetries;
    this.suiteName = addOpts.suiteName;
    this.testResults = new TestResults(tests, addOpts);
    this.screenshots = new Screenshots(settings);
    this.currentContext = null;

    this.testResults.initCurrentTest({
      module: addOpts.moduleKey,
      testName: '',
      group: addOpts.groupName
    });
  }

  /**
   * This is the exportet property on the Nightwatch api object, which is passed on to tests
   *
   * @return {null|object}
   */
  get currentTest() {
    if (!this.currentTestCase) {
      return null;
    }

    return {
      name: this.currentTestCase.testName,
      module: this.testResults.moduleKey,
      group: this.testResults.groupName,
      results: this.testResults.currentTestResult
    };
  }

  get currentTestCase() {
    return this.testResults.currentTest;
  }

  get unitTestsMode() {
    return this.currentContext ? this.currentContext.unitTestsMode : this.settings.unit_tests_mode;
  }

  get currentTestCasePassed() {
    return this.testResults.currentTestCasePassed;
  }

  get allTestsPassed() {
    return this.testResults.testsPassed();
  }

  /**
   * @param {Error} err
   *
   * @return {boolean}
   */
  shouldIncrementTotalCount(err) {
    let incrementTotalCount = true;
    let shouldRetryTestcase = this.currentTest && this.suiteRetries && this.suiteRetries.shouldRetryTest(this.currentTest.name);

    if (err.sessionConnectionRefused || shouldRetryTestcase) {
      incrementTotalCount = false;
    }

    return incrementTotalCount;
  }

  /**
   * @param {TestCase} testcase
   * @param {Context} context
   */
  setCurrentTest(testcase, context) {
    this.currentContext = context;

    this.testResults.setCurrentTest(testcase);
  }

  setFileNamePrefix(prefix) {
    this.testResults.reportPrefix = prefix;
  }

  setElapsedTime() {
    this.testResults.setElapsedTime();
  }

  testSuiteFinished() {
    this.testResults.setTotalElapsedTime();
  }

  exportResults() {
    return this.testResults.export;
  }

  ////////////////////////////////////////////////////////////
  // Results logging
  ////////////////////////////////////////////////////////////
  logAssertResult(test) {
    this.testResults.logAssertion(test);
  }

  logFailedAssertion(err) {
    Logger.logDetailedMessage(`${Logger.colors.green(Utils.symbols.fail)} ${err.message}`);

    let sections = err.stack.split('\n');
    Logger.logDetailedMessage(`${Logger.colors.stack_trace(sections.join('\n'))} \n`);
  }

  registerPassed(message) {
    Logger.logDetailedMessage(`${Logger.colors.green(Utils.symbols.ok)} ${message}`);
    this.testResults.incrementPassedCount();
  }

  registerFailed(err) {
    this.testResults.setLastError(err).incrementFailedCount(this.shouldIncrementTotalCount(err));
  }

  registerTestError(err) {
    if (!this.unitTestsMode) {
      Reporter.logError(err);
    }

    // connection Refused (ECONNREFUSED) errors will be incremented at a later stage
    if (this.shouldIncrementTotalCount(err)) {
      let errorMessage = Utils.errorToStackTrace(err);
      this.testResults.addErrorMessage(errorMessage);
    }

    this.testResults.setLastError(err).incrementErrorCount(this.shouldIncrementTotalCount(err));
  }

  static logError(err) {
    if (!Utils.isErrorObject(err)) {
      if (Utils.isObject(err)) {
        err = Object.keys(err).length > 0 ? JSON.stringify(err) : '';
      }

      err = new Error(err.message || err);
    }

    Logger.error(err);
  }

  /**
   * Subtracts the number of passed assertions from the total assertions count
   */
  resetCurrentTestPassedCount() {
    let assertionsCount = this.testResults.currentTestResult.passed;

    this.testResults.subtractPassedCount(assertionsCount);
  }

  ////////////////////////////////////////////////////////////
  // Screenshots
  ////////////////////////////////////////////////////////////
  saveErrorScreenshot(result, screenshotContent) {
    if (this.settings.screenshots.on_error && screenshotContent) {
      this.screenshots.saveErrorContent(result, screenshotContent);

      if (result.lastScreenshotFile) {
        this.addCurrentTestScreenshot(result.lastScreenshotFile);
        delete result.lastScreenshotFile;
      }
    }
  }

  addCurrentTestScreenshot(screenshotFile) {
    this.testResults.logScreenshotFile(screenshotFile);
  }

  printTestResult() {
    let ok = false;
    if (this.testResults.currentTestCasePassed) {
      ok = true;
    }

    let elapsedTime = this.testResults.currentTestElapsedTime;
    let currentTestResult = this.testResults.currentTestResult;

    const Concurrency = require('../runner/concurrency/concurrency.js');
    if (Concurrency.isChildProcess() || !this.settings.detailed_output || this.unitTestsMode) {
      this.printSimplifiedTestResult(ok, elapsedTime);

      return;
    }

    if (ok && currentTestResult.passed > 0) {
      Logger.logDetailedMessage(`\n${Logger.colors.green('OK.')} ${Logger.colors.green(currentTestResult.passed)} assertions passed. (${Utils.formatElapsedTime(elapsedTime, true)})`);
    } else if (ok && currentTestResult.passed === 0) {
      if (this.settings.start_session) {
        Logger.logDetailedMessage(Logger.colors.green('No assertions ran.'), 'warn');
      }
    } else {
      let failureMsg = this.getFailureMessage();
      Logger.logDetailedMessage(`\n${Logger.colors.red('FAILED:')} ${failureMsg} (${Utils.formatElapsedTime(elapsedTime, true)})`);
    }
  }

  /**
   * @param {boolean} ok
   * @param {number} elapsedTime
   */
  printSimplifiedTestResult(ok, elapsedTime) {
    let result = [Logger.colors[ok ? 'green': 'red'](Utils.symbols[ok ? 'ok' : 'fail'])];
    if (!this.unitTestsMode) {
      result.push(Logger.colors.cyan('[' + this.suiteName + ']'));
    }

    let testName = this.testResults.currentTest.testName;
    result.push(ok ? testName: Logger.colors.red(testName));

    if (elapsedTime > 20) {
      result.push(Logger.colors.yellow('(' + Utils.formatElapsedTime(elapsedTime, true) + ')'));
    }

    console.log(result.join(' '));
    if (ok || !this.currentTest) {
      return;
    }

    let results = this.currentTest.results;
    if (this.unitTestsMode && results.lastError) {
      Logger.error(results.lastError);
    } else {
      Reporter.printAssertions(results);
    }
  }

  static printAssertions(testcase) {
    testcase.assertions.forEach(function(a) {
      if (a.failure !== false) {
        let message = a.stackTrace.split('\n');
        message.unshift(a.fullMsg);
        Utils.showStackTrace(message.join('\n'));
      }
    });
  }

  getFailureMessage() {
    let failureMsg = [];
    let currentTestResult = this.testResults.currentTestResult;

    if (currentTestResult.failed > 0) {
      failureMsg.push(`${Logger.colors.red(currentTestResult.failed)} assertions failed`);
    }

    if (currentTestResult.errors > 0) {
      failureMsg.push(`${Logger.colors.red(currentTestResult.errors)} errors`);
    }

    if (currentTestResult.passed > 0) {
      failureMsg.push(`${Logger.colors.green(currentTestResult.passed)} passed`);
    }

    if (currentTestResult.skipped > 0) {
      failureMsg.push(`${Logger.colors.blue(currentTestResult.skipped)} skipped`);
    }

    return failureMsg.join(', ').replace(/,([^,]*)$/g, function(p0, p1) {
      return ` and ${p1}`;
    });
  }
}

module.exports = Reporter;
