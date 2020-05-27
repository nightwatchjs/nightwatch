const Utils = require('../utils');

module.exports = class Results {
  constructor(tests = [], opts) {
    this.skipped = tests.slice(0);
    this.testcases = {};
    this.suiteName = opts.suiteName;
    this.moduleKey = opts.moduleKey;
    this.modulePath = opts.modulePath;
    this.groupName = opts.groupName;
    this.reportPrefix = opts.reportPrefix;
    this.globalStartTime = new Date().getTime();
    this.currentTestName = '';
    this.__currentTest = null;
    this.__initialResult = {
      errors: 0,
      failed: 0,
      passed: 0,
      assertions: [],
      tests: 0
    };

    this.initCount();
  }

  get initialResult() {
    return this.__initialResult;
  }

  get currentTestResult() {
    const testName = this.currentTest.name;

    return this.getTestResult(testName, {returnFullResult: true});
  }

  /**
   * @param {TestCase} value
   */
  set currentTest(value) {
    this.__currentTest = value;
  }

  getTestResult(testName, {returnFullResult = false} = {}) {
    if (!testName || !this.testcases[testName]) {
      return this.initialResult;
    }

    const currentTest = this.testcases[testName];
    if (returnFullResult) {
      currentTest.steps = this.skipped;
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
    }

    return currentTest;
  }

  /**
   * @return {TestCase}
   */
  getCurrentTest() {
    return this.__currentTest;
  }

  get currentTest() {
    if (!this.__currentTest) {
      return null;
    }

    const name = this.__currentTest.testName;

    return {
      name,
      module: this.moduleKey,
      group: this.groupName,
      results: this.getTestResult(name, {returnFullResult: true})
    };
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
    let lastError = null;
    const {moduleKey, reportPrefix} = this;

    const suiteResults = {
      moduleKey,
      hasFailures: !this.testsPassed(),
      results: {
        reportPrefix,
        assertionsCount: this.initialResult.assertions.length
      }
    };

    Object.keys(this.testcases).forEach(key => {
      let testcase = this.testcases[key];
      if (testcase.lastError) {
        //lastError = testcase.lastError;
      }
      suiteResults.results.assertionsCount += testcase.assertions.length;
    });

    if (!lastError && this.lastError) {
      lastError = this.lastError;
    }

    suiteResults.results.lastError = lastError;
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
    suiteResults.results.modulePath = this.modulePath;

    // Backwards compat
    suiteResults.results.tests = this.testsCount;
    suiteResults.results.failures = this.failedCount;
    suiteResults.results.errors = this.errorsCount;
    suiteResults.results.group = this.groupName;

    return suiteResults;
  }

  initCurrentTest(testcase) {
    this.currentTest = testcase;

    return this;
  }

  resetCurrentTestName() {
    // FIXME: in v2, this needs to be this.__currentTest.testName, but it isn't desirable now because will make
    //  client.currentTest.name empty in the after() hook and potentially introduce breaking changes
    //this.__currentTest.testName = '';

    this.currentTestName = '';
  }

  getCurrentTestName() {
    // FIXME: see resetCurrentTestName()
    const {testName} = this.getCurrentTest() || {};

    return this.currentTestName;
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

  setLastError(err, {incrementTotal, addToErrArray = false} = {}) {
    const testName = this.getCurrentTestName();
    this.__lastError = err;

    if (testName && this.testcases[testName]) {
      this.testcases[testName].lastError = err;
    }

    // connection Refused (ECONNREFUSED) errors will be incremented at a later stage
    const detailedLogging = err.detailedLogging || Utils.isUndefined(err.detailedLogging);
    if ((!testName || addToErrArray) && incrementTotal && detailedLogging) {
      const errorMessage = Utils.errorToStackTrace(err);
      this.errmessages.push(errorMessage);
    }

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

    const result = this.getTestResult(this.currentTestName);
    result.errors++;

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

    const result = this.getTestResult(this.currentTestName);
    result.failed++;

    return this;
  }

  incrementPassedCount() {
    this.__passedCount++;

    const result = this.getTestResult(this.currentTestName);
    result.passed++;

    return this;
  }

  subtractPassedCount(count = 0) {
    this.__passedCount = this.__passedCount - count;

    return this;
  }

  /**
   * @param {Object} assertion
   * @return {module.Results}
   */
  logAssertion(assertion) {
    const result = this.getTestResult(this.currentTestName);
    result.assertions.push(assertion);

    // backwards compatibility
    result.tests++;

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
    const currentTest = this.getCurrentTest();
    const startTime = currentTest ? currentTest.startTime : this.globalStartTime;
    const elapsedTime = new Date().getTime() - startTime;

    this.time += elapsedTime;

    if (currentTest) {
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
    this.currentTestName = testName;
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
      if (Array.isArray(results.errmessages) && results.errmessages.length > 0) {
        prev.errmessages = prev.errmessages.concat(results.errmessages);
      }

      prev.modules[item.moduleKey] = results;

      return prev;
    }, initialReport);
  }
};
