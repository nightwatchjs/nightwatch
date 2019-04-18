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
    if (!this.currentTest.testName || !this.testcases[this.currentTest.testName]) {
      return {
        errors: 0,
        failed: 0,
        passed: 0,
        assertions: [],
        tests: 0
      };
    }

    let currentTest = this.testcases[this.currentTest.testName];
    currentTest.steps = this.skipped;
    currentTest.lastError = this.lastError;
    currentTest.stackTrace = this.stackTrace;
    currentTest.testcases = Object.keys(this.testcases).reduce((prev, key) => {
      prev[key] = Object.keys(this.testcases[key]).reduce((prevVal, prop) => {
        if (prop !== 'testcases') {
          prevVal[prop] = this.testcases[key][prop];
        }
        if (prop === 'assertions') {
          prevVal.tests = this.testcases[key].assertions;
        }

        return prevVal;
      }, {});

      return prev;
    }, {});

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

  get stackTrace() {
    return (this.__lastError && this.__lastError instanceof Error) ? this.__lastError.stack : '';
  }

  get currentTestElapsedTime() {
    return this.currentTestResult.timeMs;
  }

  get currentTestCasePassed() {
    return this.currentTestResult.errors === 0 && this.currentTestResult.failed === 0;
  }

  /**
   * Exports the complete results for the entire testsuite
   *
   * @return {object}
   */
  get export() {
    let suiteResults = {
      moduleKey: this.moduleKey,
      hasFailures: !this.testsPassed(),
      results: {
        reportPrefix: this.reportPrefix,
        assertionsCount: 0,
        lastError: this.lastError
      }
    };

    Object.keys(this.testcases).forEach(key => {
      let testcase = this.testcases[key];
      suiteResults.results.assertionsCount += testcase.assertions.length;
    });

    suiteResults.results.skipped = this.skipped;
    suiteResults.results.time = this.time;
    suiteResults.results.completed = this.testcases;
    suiteResults.results.errmessages = this.errmessages;
    suiteResults.results.testsCount = this.testsCount;
    suiteResults.results.skippedCount = this.skippedCount;
    suiteResults.results.failedCount = this.failedCount;
    suiteResults.results.errorsCount = this.errorsCount;
    suiteResults.results.passedCount = this.passedCount;
    suiteResults.results.group = this.groupName;

    // Backwards compat
    suiteResults.results.tests = this.testsCount;
    suiteResults.results.failures = this.failedCount;
    suiteResults.results.errors = this.errorsCount;
    suiteResults.results.group = this.groupName;

    return suiteResults;
  }

  initCurrentTest(val) {
    this.currentTest = val;

    return this;
  }
  /**
   * @param {TestCase} testcase
   * @return {Object}
   */
  createTestCaseResults(testcase) {
    return {
      time: 0,
      assertions: [],
      passed: 0,
      errors: 0,
      failed: 0,
      retries: testcase.retriesCount,
      skipped: 0,
      tests: 0
    };
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
    // backwards compatibility
    this.currentTestResult.tests++;

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
   * Sets the currently running testcase
   *
   * @param {TestCase} testcase
   * @return {Results}
   */
  setCurrentTest(testcase) {
    this.currentTest = testcase;

    let testName = testcase.testName;
    this.testcases[testName] = this.createTestCaseResults(testcase);

    let index = this.skipped.indexOf(testName);
    if (index > -1) {
      this.skipped.splice(index, 1);
    }

    this.__testsCount++;

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

  /**
   * Combines all the individual test suite reports into a global one
   *
   * @param {Array} suiteResultsArr
   * @param {Object} initialReport
   * @return {Object}
   */
  static createGlobalReport(suiteResultsArr, initialReport) {
    return suiteResultsArr.reduce((prev, item) => {
      let results = item.results;

      if (results.lastError) {
        prev.lastError = results.lastError;
      }

      // Accumulating stats
      prev.passed += results.passedCount;
      prev.failed += results.failedCount;
      prev.errors += results.errorsCount;
      prev.skipped += results.skippedCount;
      prev.assertions += results.assertionsCount;

      // Accumulating error messages
      if (Array.isArray(item.errmessages) && item.errmessages.length > 0) {
        prev.errmessages = prev.errmessages.concat(item.errmessages);
      }

      prev.modules[item.moduleKey] = results;

      return prev;
    }, initialReport);
  }
}

module.exports = Results;
