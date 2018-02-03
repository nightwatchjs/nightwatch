const TestCase = require('./testcase.js');

class Results {
  constructor(tests = [], opts) {
    this.skipped = tests.slice(0);
    this.testcases = {};
    this.suiteName = opts.suiteName;
    this.moduleKey = opts.moduleKey;
    this.groupName = opts.groupName;
    this.reporterPrefix = opts.reporterPrefix;
    this.__currentTest = null;

    this.initCount();
  }

  get currentTestResult() {
    return this.testcases[this.currentTest.testName];
  }

  /**
   * @param {TestCase} value
   */
  set currentTest(value) {
    this.__currentTest = value;
  }

  /**
   * @return {TestCase}
   */
  get currentTest() {
    return this.__currentTest;
  }

  ////////////////////////////////////////////////////////////
  // Counters
  ////////////////////////////////////////////////////////////
  get passedCount() {
    return this.__passedCount;
  }

  get failedCount() {
    return this.__failedCount;
  }

  get errorsCount() {
    return this.__errorsCount;
  }

  get skippedCount() {
    return this.__skippedCount;
  }

  get timestamp() {
    return this.__timestamp;
  }

  get testsCount() {
    return this.__testsCount;
  }

  get lastError() {
    return this.__lastError;
  }

  get currentTestElapsedTime() {
    return this.currentTestResult.timeMs;
  }

  setLastError(val) {
    this.__lastError = val;

    return this;
  }

  incrementErrorCount() {
    this.__errorsCount++;
    this.currentTestResult.errors++;

    return this;
  }

  incrementFailedCount() {
    this.__failedCount++;
    this.currentTestResult.failed++;

    return this;
  }

  incrementPassedCount() {
    this.__passedCount++;
    this.currentTestResult.passed++;

    return this;
  }

  addErrorMessage(error) {
    this.errmessages.push(error);

    return this;
  }

  logAssertion(test) {
    this.currentTestResult.assertions.push(test);

    return this;
  }

  initCount() {
    this.__passedCount = 0;
    this.__failedCount = 0;
    this.__errorsCount = 0;
    this.__skippedCount = 0;
    this.__testsCount = 0;
    this.__timestamp = new Date().toUTCString();
    this.errmessages = [];
    this.time = 0;
  }

  setElapsedTime() {
    let elapsedTime = new Date().getTime() - this.currentTest.startTime;

    this.time += elapsedTime;
    this.currentTestResult.time = (elapsedTime/1000).toPrecision(4);
    this.currentTestResult.timeMs = elapsedTime;

    return this;
  }

  setTotalElapsedTime() {
    this.time = (this.time/1000).toPrecision(4);

    return this;
  }

  /**
   *
   * @param {TestCase} testcase
   * @return {Results}
   */
  setCurrentTest(testcase) {
    let testName = testcase.testName;

    this.__testsCount++;
    this.currentTest = testcase;
    this.testcases[testName] = {
      time: 0,
      assertions: [],
      passed: 0,
      errors: 0,
      failed: 0,
      skipped: 0 // TODO: implement skipped
    };

    // backwards compatibility:
    this.testcases[testName].tests = this.testcases[testName].assertions;

    let index = this.skipped.indexOf(testName);
    if (index > -1) {
      this.skipped.splice(index, 1);
    }

    return this;
  }

  logScreenshotFile(screenshotFile) {
    let assertions = this.currentTestResult.assertions;
    let lastAssertion = assertions[assertions.length - 1];

    if (lastAssertion) {
      lastAssertion.screenshots = lastAssertion.screenshots || [];
      lastAssertion.screenshots.push(screenshotFile);
    }
  }

  testsPassed() {
    return this.failedCount === 0 && this.errorsCount === 0;
  }
}

module.exports = Results;