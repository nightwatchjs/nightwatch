const path = require('path');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const TestResults = require('./results.js');
const TestCase = require('./testcase.js');
const Context = require('./context.js');
const Screenshots = require('./screenshots.js');

class Reporter {
  constructor(tests, settings, addOpts) {
    this.settings = settings;
    this.testResults = new TestResults(tests, addOpts);
    this.screenshots = new Screenshots(this, settings);
    this.currentTestCase = null;
    this.currentContext = null;
  }

  get currentTest() {
    return {
      module: this.currentContext.moduleKey.replace(path.sep , '/'),
      name: this.currentTestCase.testName,
      group: this.currentContext.groupName,
      results: this.testResults.currentTestResult
    };
  }

  /**
   * @param {TestCase} testcase
   * @param {Context} context
   */
  setCurrentTest(testcase, context) {
    this.currentTestCase = testcase;
    this.currentContext = context;

    this.testResults.setCurrentTest(testcase);
  }

  setElapsedTime() {
    this.testResults.setElapsedTime();
  }

  testSuiteFinished() {
    this.testResults.setTotalElapsedTime();
  }

  ////////////////////////////////////////////////////////////
  // Results logging
  ////////////////////////////////////////////////////////////
  logAssertResult(test) {
    this.testResults.logAssertion(test);
  }

  logFailedAssertion(err) {
    Logger.logDetailedMessage(`${Logger.colors.red(Utils.symbols.fail)} ${err.message}`);

    let sections = err.stack.split('\n');
    Logger.logDetailedMessage(`${Logger.colors.stack_trace(sections.join('\n'))} \n`);
  }

  registerPassed(message) {
    Logger.logDetailedMessage(`${Logger.colors.green(Utils.symbols.ok)} ${message}`);
    this.testResults.incrementPassedCount();
  }

  registerFailed(err) {
    this.testResults.setLastError(err).incrementFailedCount();
  }

  registerTestError(err) {
    this.testResults.incrementErrorCount();
    this.logError(err);
  }

  logError(err) {
    if (!Utils.isErrorObject(err)) {
      if (typeof err == 'object') {
        err = Object.keys(err).length > 0 ? JSON.stringify(err) : '';
      }

      err = new Error(err.message || err);
    }

    let errorMessage = Utils.errorToStackTrace(err);

    this.testResults.addErrorMessage(errorMessage);
    Logger.error(err);
  }


  ////////////////////////////////////////////////////////////
  // Global
  ////////////////////////////////////////////////////////////
  printGlobalError(err) {
    let stackTrace = '';
    if (err.stack) {
      stackTrace = err.stack.split('\n').slice(1).join('\n');
    }

    this.logError(`${err.name}: ${err.message} \n ${stackTrace}`);

    if (Logger.isOutputEnabled()) {
      Utils.showStackTraceWithHeadline(err.name + ': ' + err.message, stackTrace, true);
    }
  }

  ////////////////////////////////////////////////////////////
  // Screenshots
  ////////////////////////////////////////////////////////////
  saveErrorScreenshot(result, screenshotContent) {
    if (this.settings.screenshots.on_error) {
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
    if (this.testResults.testsPassed()) {
      ok = true;
    }

    let elapsedTime = this.testResults.currentTestElapsedTime;

    if (ok && this.testResults.passedCount > 0) {
      console.log(`\n${Logger.colors.green('OK.')} ${Logger.colors.green(this.testResults.passedCount)} assertions passed. (${Utils.formatElapsedTime(elapsedTime, true)})`);
    } else if (ok && this.testResults.passedCount === 0) {
      if (this.settings.start_session) {
        console.log(Logger.colors.green('No assertions ran.'));
      }
    } else {
      let failureMsg = this.getFailureMessage();
      console.log(`\n${Logger.colors.red('FAILED:')} ${failureMsg} (${Utils.formatElapsedTime(elapsedTime, true)})`);
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

    if (testcase.stackTrace) {
      Utils.showStackTrace(testcase.stackTrace);
    }
  }

  getFailureMessage() {
    let failureMsg = [];
    if (this.testResults.failedCount > 0) {
      failureMsg.push(`${Logger.colors.red(this.testResults.failedCount)} assertions failed`);
    }

    if (this.testResults.errorsCount > 0) {
      failureMsg.push(`${Logger.colors.red(this.testResults.errorsCount)} errors`);
    }

    if (this.testResults.passedCount > 0) {
      failureMsg.push(`${Logger.colors.green(this.testResults.passedCount)} passed`);
    }

    if (this.testResults.skippedCount > 0) {
      failureMsg.push(`${Logger.colors.blue(this.testResults.skippedCount)} skipped`);
    }

    return failureMsg.join(', ').replace(/,([^,]*)$/g, function(p0, p1) {
      return ` and ${p1}`;
    });
  }

  /*
  getCurrentTestName() {
    let currentTest;
    if (this.api.currentTest) {
      currentTest = '[' + Utils.getTestSuiteName(this.api.currentTest.module) + ' / ' + this.api.currentTest.name + ']';
    } else {
      currentTest = 'tests';
    }

    return currentTest;
  }

  handleTestException(err, terminateFn = function() {}) {
    let stackTrace = err.stack.split('\n');
    let failMessage = stackTrace.shift();

    let firstLine = ` ${String.fromCharCode(10006)} ${failMessage}`;
    let expectedMsg;
    let actualMsg;

    if (typeof err.actual != 'undefined' && typeof err.expected != 'undefined') {
      expectedMsg = `"${err.expected}"`;
      actualMsg = `"${err.actual}"`;

      firstLine += ` - expected ${Logger.colors.green(expectedMsg)} but got: ${Logger.colors.red(actualMsg)}`;
    }

    if (Logger.isOutputEnabled()) {
      Utils.showStackTraceWithHeadline(firstLine, stackTrace);
    }

    if (err.name == 'AssertionError') {
      this.incrementFailedNo();
      stackTrace.unshift(`${failMessage} - expected "${expectedMsg}" but got: "${actualMsg}"`);

      this.stackTrace = stackTrace.join('\n');
    } else {
      let currentTest = this.getCurrentTestName();
      this.registerTestError(`  Error while running ${currentTest} :\n${err.stack}`);

      if (Logger.isOutputEnabled()) {
        Utils.showStackTraceWithHeadline(err.name + ': ' + err.message, err.stack, true);
      }
      terminateFn();
    }
  }
*/
}

//const __instance = new Reporter();

module.exports = Reporter;