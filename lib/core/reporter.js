const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');

class Reporter {
  constructor() {
    this.__results_no__ = {
      errors: 0
    };

    this.__errors__ = [];
    this.__results__ = {
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      tests: []
    };
  }

  get results() {
    return this.__results__;
  }

  set stackTrace(val) {
    this.__results__.stackTrace = val;
  }

  set errorsNo(val) {
    this.__results_no__.errors = val;
  }

  get errorsNo() {
    return this.__results_no__.errors;
  }

  get errors() {
    return this.__errors__;
  }

  get lastAddedTest() {
    if (this.__results__.tests.length === 0) {
      return null;
    }
    return this.__results__.tests[this.__results__.tests.length - 1];
  }

  clearResult() {
    this.__errors__ = [];
    this.__results__.passed = 0;
    this.__results__.failed = 0;
    this.__results__.errors = 0;
    this.__results__.skipped = 0;
    this.__results__.tests = [];
  }

  logError(err) {
    let message;
    if (err instanceof Error) {
      message = err.stack;
    } else if (err.message) {
      message = err.message;
    } else if (typeof err == 'object') {
      message = Object.keys(err).length > 0 ? JSON.stringify(err) : '';
    } else {
      message = err;
    }

    this.__errors__.push(message);
  }

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

  addCurrentTestScreenshot(screenshotFile) {
    if (this.lastAddedTest) {
      this.lastAddedTest.screenshots = this.lastAddedTest.screenshots || [];
      this.lastAddedTest.screenshots.push(screenshotFile);
    }
  }

  saveErrorScreenshot(content) {
    /*
    if (self.options.screenshots.on_error) {
      let fileNamePath = Utils.getScreenshotFileName(self.api.currentTest, true, self.options.screenshots.path);
      Utils.writeScreenshotToFile(fileNamePath, screenshotContent, {output: true});
      result.lastScreenshotFile = fileNamePath;

      if (result.lastScreenshotFile) {
        Reporter.addCurrentTestScreenshot(result.lastScreenshotFile);

        delete result.lastScreenshotFile;
      }
    }
    */
  }

  incrementErrorsNo() {
    this.errorsNo++;
  }

  incrementFailedNo() {
    this.__results__.failed++;
  }

  registerTestError(err) {
    this.incrementErrorsNo();

    this.logError(err);
  }

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

  printResult(elapsedTime, startSessionEnabled) {
    let ok = false;
    if (this.results.failed === 0 && this.results.errors === 0) {
      ok = true;
    }

    if (ok && this.results.passed > 0) {
      console.log(`\n ${Logger.colors.green('OK.')} ${Logger.colors.green(this.results.passed)} assertions passed. (${Utils.formatElapsedTime(elapsedTime, true)})`);
    } else if (ok && this.results.passed === 0) {
      if (startSessionEnabled) {
        console.log(Logger.colors.green('No assertions ran.'));
      }
    } else {
      let failureMsg = this.getFailureMessage();
      console.log(`\n ${Logger.colors.red('FAILED: ')} ${failureMsg} (${Utils.formatElapsedTime(elapsedTime, true)})`);
    }
  }

  getFailureMessage() {
    let failureMsg = [];
    if (this.results.failed > 0) {
      failureMsg.push(`${Logger.colors.red(this.results.failed)} assertions failed`);
    }

    if (this.results.errors > 0) {
      failureMsg.push(`${Logger.colors.red(this.results.errors)} errors`);
    }

    if (this.results.passed > 0) {
      failureMsg.push(`${Logger.colors.green(this.results.passed)} passed`);
    }

    if (this.results.skipped > 0) {
      failureMsg.push(`${Logger.colors.blue(this.results.skipped)} skipped`);
    }

    return failureMsg.join(', ').replace(/,([^,]*)$/g, function(p0, p1) {
      return ` and ${p1}`;
    });
  }
}

let __instance = null;

module.exports = (function() {
  if (!__instance) {
    __instance = new Reporter();
  }

  return __instance;
})();