const TestCase = require('./testcase.js');

class Results {
  constructor(tests = [], opts) {
    this.skipped = tests.slice(0);
    this.testcases = {};
    this.suiteName = opts.suiteName;
    this.moduleKey = opts.moduleKey;
    this.groupName = opts.groupName;
    this.reportPrefix = opts.reportPrefix;
    this.globalStartTime = new Date().getTime();
    this.__currentTest = null;

    this.initCount();
  }

  get currentTestResult() {
    let currentTest = this.testcases[this.currentTest.testName];
    if (!currentTest) {
      return null;
    }

    currentTest.lastError = this.lastError;

    return currentTest;
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

  get currentTestCasePassed() {
    return this.currentTestResult.errors === 0 && this.currentTestResult.failed === 0;
  }


  get export() {
    let exportValue = {
      moduleKey: this.moduleKey,
      hasFailures: !this.testsPassed(),
      reportPrefix: this.reportPrefix,
      results: {
        assertionsCount: 0,
        lastError: this.lastError
      }
    };

    Object.keys(this.testcases).forEach(key => {
      let testcase = this.testcases[key];
      exportValue.results.assertionsCount += testcase.assertions.length;
    });

    exportValue.results.skipped = this.skipped;
    exportValue.results.time = this.time;
    exportValue.results.completed = this.testcases;
    exportValue.results.errmessages = this.errmessages;
    exportValue.results.testsCount = this.testsCount;
    exportValue.results.skippedCount = this.skippedCount;
    exportValue.results.failedCount = this.failedCount;
    exportValue.results.errorsCount = this.errorsCount;
    exportValue.results.passedCount = this.passedCount;
    exportValue.results.group = this.groupName;

    return exportValue;
  }

  setLastError(val) {
    this.__lastError = val;

    return this;
  }

  /**
   * @param {Boolean} incrementTotal
   * @return {Results}
   */
  incrementErrorCount(incrementTotal = true) {
    if (incrementTotal) {
      this.__errorsCount++;
    }

    this.currentTestResult.errors++;

    return this;
  }

  /**
   * @param {Boolean} incrementTotal
   * @return {Results}
   */
  incrementFailedCount(incrementTotal = true) {
    if (incrementTotal) {
      this.__failedCount++;
    }

    this.currentTestResult.failed++;

    return this;
  }

  incrementPassedCount() {
    this.__passedCount++;
    this.currentTestResult.passed++;

    return this;
  }

  subtractPassedCount(count = 0) {
    this.__passedCount = this.__passedCount - count;

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
    let startTime = this.currentTest ? this.currentTest.startTime : this.globalStartTime;
    let elapsedTime = new Date().getTime() - startTime;

    this.time += elapsedTime;

    if (this.currentTest) {
      this.currentTestResult.time = (elapsedTime/1000).toPrecision(4);
      this.currentTestResult.timeMs = elapsedTime;
    }

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
      retries: testcase.retriesCount,
      lastError: this.lastError,
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