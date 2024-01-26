const lodashMerge = require('lodash/merge');
const Utils = require('../utils');
const {Logger} = Utils;

module.exports = class Results {
  static get TEST_FAIL() {
    return 'fail';
  }

  static get TEST_PASS() {
    return 'pass';
  }

  static get TEST_SKIP() {
    return 'skip';
  }

  constructor(tests = [], opts, settings, skippedTests = [], allScreenedTests = []) {
    this.skippedByUser = skippedTests;
    this.skippedAtRuntime = tests.slice(0);
    this.testcases = {};
    this.testSections = {};
    this.testSectionHook = {};
    this.isHookRunning = false;
    this.suiteName = opts.suiteName;
    this.moduleKey = opts.moduleKey;
    this.modulePath = opts.modulePath;
    this.groupName = opts.groupName;
    this.reportPrefix = opts.reportPrefix;
    this.testEnv = settings.testEnv;
    this.isMobile = opts.isMobile;
    this.globalStartTime = new Date().getTime();
    this.startTimestamp = this.globalStartTime;
    this.endTimestamp = this.globalStartTime;
    this.currentTestName = '';
    this.currentSectionName = '';
    this.__currentTest = null;
    this.__initialResult = {
      errors: 0,
      failed: 0,
      passed: 0,
      assertions: [],
      commands: [],
      tests: 0
    };
    // Adding sessionInfo to reporter
    const {capabilities = {}, desiredCapabilities = {}} = settings;
    this.sessionCapabilities = capabilities || desiredCapabilities;
    this.sessionId = '';
    this.projectName = capabilities.projectName || desiredCapabilities.projectName || '';
    this.buildName = capabilities.buildName || desiredCapabilities.buildName || '';
    const {webdriver = {}} = settings;
    this.host = webdriver.host || '';
    this.name = opts.suiteName || '';
    this.tags = opts.tags || [];
    this.__retryTest = false;

    this.initCount(allScreenedTests);
  }

  markHookRun(hookName) {
    this.isHookRunning = true;
    this.currentHookName = hookName;
    this.testSectionHook = this.createTestCaseResults({testName: `${this.currentSectionName}__${hookName}`});

    // reset test hooks output
    Logger.collectTestHooksOutput();
  }

  unmarkHookRun() {
    this.isHookRunning = false;
    if (!this.currentHookName) {
      throw new Error('Hook run not started yet');
    }

    const currentSection = this.getTestSection(this.currentSectionName);
    const hookdata = this.testSectionHook;

    const startTime = hookdata.startTimestamp;
    const endTime = new Date().getTime();
    const elapsedTime = endTime - startTime;
    hookdata.endTimestamp = endTime;

    hookdata.time = (elapsedTime / 1000).toPrecision(4);
    hookdata.timeMs = elapsedTime;

    hookdata.httpOutput = Logger.collectTestHooksOutput();

    if (hookdata.errors > 0 || hookdata.failed > 0) {
      hookdata.status = Results.TEST_FAIL;
    }

    currentSection[this.currentHookName] = hookdata;
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
      currentTest.steps = this.skippedAtRuntime;
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

  getTestSection(testName) {
    if (!testName || !this.testSections[testName]) {
      return this.initialResult;
    }

    return this.testSections[testName];
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
      results: this.getTestResult(name, {returnFullResult: true}),
      timestamp: this.timestamp
    };
  }

  get currentSection() {
    return this.getTestSection(this.currentSectionName);
  }

  hasFailures() {
    return this.currentTestResult.errors > 0 || this.currentTestResult.failed > 0;
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
      const testcase = this.testcases[key];
      if (testcase.lastError) {
        //lastError = testcase.lastError;
      }
      suiteResults.results.assertionsCount += testcase.assertions.length;
    });

    if (!lastError && this.lastError) {
      lastError = this.lastError;
    }

    suiteResults.results.lastError = lastError;
    suiteResults.results.skippedAtRuntime = this.skippedAtRuntime;
    suiteResults.results.skippedByUser = this.skippedByUser;
    suiteResults.results.skipped = [...this.skippedAtRuntime, ...this.skippedByUser];
    suiteResults.results.time = this.time;
    suiteResults.results.timeMs = this.timeMs;
    suiteResults.results.completed = this.testcases;
    suiteResults.results.completedSections = this.testSections;
    suiteResults.results.errmessages = this.errmessages;
    suiteResults.results.testsCount = this.testsCount;
    suiteResults.results.skippedCount = this.skippedCount;
    suiteResults.results.failedCount = this.failedCount;
    suiteResults.results.errorsCount = this.errorsCount;
    suiteResults.results.passedCount = this.passedCount;
    suiteResults.results.group = this.groupName;
    suiteResults.results.modulePath = this.modulePath;
    suiteResults.results.startTimestamp = new Date(this.startTimestamp).toUTCString();
    suiteResults.results.endTimestamp = new Date(this.endTimestamp).toUTCString();
    suiteResults.results.sessionCapabilities = this.sessionCapabilities;
    suiteResults.results.sessionId = this.sessionId;
    suiteResults.results.projectName = this.projectName;
    suiteResults.results.buildName = this.buildName;
    suiteResults.results.testEnv = this.testEnv;
    suiteResults.results.isMobile = this.isMobile;
    suiteResults.results.status = this.getTestStatus();
    suiteResults.results.seleniumLog = this.seleniumLog;
    suiteResults.results.host = this.host;
    suiteResults.results.name = this.name;
    suiteResults.results.tags = this.tags;

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

  resetCurrentSectionName() {
    this.currentSectionName = '';
  }

  getCurrentTestName() {
    // FIXME: see resetCurrentTestName()
    const {testName} = this.getCurrentTest() || {};

    return this.currentTestName;
  }

  set retryTest(value) {
    this.__retryTest = value;
  }

  get retryTest() {
    return this.__retryTest;
  }

  /**
   * @param {TestCase} testcase
   * @return {Object}
   */
  createTestCaseResults(testcase) {
    const result = {
      time: 0,
      assertions: [],
      commands: [],
      passed: 0,
      errors: 0,
      failed: 0,
      retries: testcase.retriesCount,
      skipped: 0,
      tests: 0,
      status: Results.TEST_PASS,
      startTimestamp: new Date().getTime(),
      httpOutput: []
    };

    if (this.retryTest && this.testSections[testcase.testName]) {
      const retryTestData = this.testSections[testcase.testName];

      result['retryTestData'] = [retryTestData];

      if (retryTestData['retryTestData']) {
        result['retryTestData'].push(...retryTestData['retryTestData']);

        delete retryTestData['retryTestData'];
      }

      this.retryTest = false;
    }

    return result;
  }

  resetLastError() {
    this.__lastError = null;
  }

  setLastError(err, {incrementTotal, addToErrArray = false} = {}) {
    const testName = this.getCurrentTestName();
    this.__lastError = err;

    if (testName && this.testcases[testName]) {
      this.testcases[testName].lastError = err;

      if (addToErrArray) {
        this.testcases[testName].errorsPerTest = this.testcases[testName].errorsPerTest || [];
        this.testcases[testName].errorsPerTest.push(err.message);
      }
    }

    const detailedLogging = err.detailedLogging || Utils.isUndefined(err.detailedLogging);
    if ((!testName || addToErrArray) && incrementTotal && detailedLogging) {
      const errorMessage = Logger.getErrorContent(err, this.modulePath);
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

  logCommand(command) {
    const result = this.getTestSection(this.currentSectionName);
    result.commands.push(command);

    if (this.isHookRunning) {
      this.testSectionHook.commands.push(command);
    }

    return this;
  }

  initCount(allScreenedTests) {
    this.__passedCount = 0;
    this.__failedCount = 0;
    this.__errorsCount = 0;
    this.__skippedCount = allScreenedTests.length;
    this.__testsCount = 0;
    this.__timestamp = new Date().toUTCString();
    this.errmessages = [];
    this.time = 0;
  }

  setElapsedTime() {
    const currentTest = this.getCurrentTest();
    const startTime = currentTest ? currentTest.startTime : this.globalStartTime;
    const endTime = new Date().getTime();
    const elapsedTime = endTime - startTime;
    this.endTimestamp = endTime;

    this.time += elapsedTime;

    if (currentTest) {
      this.currentTestResult.time = (elapsedTime / 1000).toPrecision(4);
      this.currentTestResult.timeMs = elapsedTime;
      this.currentTestResult.startTimestamp = new Date(startTime).toUTCString();
      this.currentTestResult.endTimestamp = new Date(endTime).toUTCString();

    }

    return this;
  }

  setTestSectionElapsedTime() {
    const currentSection = this.getTestSection(this.currentSectionName);
    const startTime = currentSection ? currentSection.startTimestamp : this.globalStartTime;
    const endTime = new Date().getTime();
    const elapsedTime = endTime - startTime;
    this.endTimestamp = endTime;

    this.time += elapsedTime;

    if (currentSection) {
      currentSection.time = (elapsedTime / 1000).toPrecision(4);
      currentSection.timeMs = elapsedTime;
      currentSection.startTimestamp = startTime;
      currentSection.endTimestamp = endTime;

    }

    return this;
  }

  setTestStatus() {
    const currentTest = this.getCurrentTest();
    const currentSection = this.getTestSection(this.currentSectionName);
    if (!currentTest) {
      return;
    }

    if (this.hasFailures()) {
      this.currentTestResult.status = Results.TEST_FAIL;
      currentSection.status = Results.TEST_FAIL;
    } else {
      this.currentTestResult.status = Results.TEST_PASS;
      currentSection.status = Results.TEST_PASS;
    }
  }

  collectTestSectionOutput() {
    const currentSection = this.getTestSection(this.currentSectionName);
    if (!currentSection) {
      return;
    }

    currentSection.httpOutput = Logger.collectTestSectionOutput();
  }

  setTotalElapsedTime() {
    this.timeMs = this.time;
    this.time = (this.time / 1000).toPrecision(4);

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

    const testName = testcase.testName;
    this.currentTestName = testName;
    this.testcases[testName] = this.createTestCaseResults(testcase);

    const index = this.skippedAtRuntime.indexOf(testName);
    if (index > -1) {
      this.skippedAtRuntime.splice(index, 1);
      this.__skippedCount -= 1;
    }

    this.__testsCount++;

    return this;
  }

  setCurrentSection(testcase) {
    this.currentSectionName = testcase.testName;
    this.testSections[testcase.testName] = this.createTestCaseResults(testcase);
  }

  setSeleniumLogFile(outputFilePath) {
    this.seleniumLog = outputFilePath;
  }

  logScreenshotFile(screenshotFile) {
    const assertions = this.currentTestResult.assertions;
    const lastAssertion = assertions[assertions.length - 1];

    if (lastAssertion) {
      lastAssertion.screenshots = lastAssertion.screenshots || [];
      lastAssertion.screenshots.push(screenshotFile);
    }
  }

  testsPassed() {
    return this.failedCount === 0 && this.errorsCount === 0;
  }

  getTestStatus() {
    if (this.failedCount > 0 || this.errorsCount > 0) {
      return Results.TEST_FAIL;
    }

    if (this.passedCount > 0) {
      return Results.TEST_PASS;
    }

    return Results.TEST_SKIP;
  }


  /**
   * Appends data in current testSections data.
   *
   * @param {Object} data
   */
  appendTestResult(data) {
    lodashMerge(this.testSections, data);
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
      const results = item.results;

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

      results.httpOutput = item.httpOutput || [];
      results.rawHttpOutput = item.rawHttpOutput || [];
      prev.modules[item.moduleKey] = results;
      prev.modulesWithEnv[item.results.testEnv] = prev.modulesWithEnv[item.results.testEnv] || {};
      prev.modulesWithEnv[item.results.testEnv][item.moduleKey] = results;

      return prev;
    }, initialReport);
  }

  get eventDataToEmit() {
    const {testEnv, sessionCapabilities, sessionId, tags, modulePath, name, host} = this;

    return {
      envelope: this.testSections,
      metadata: {
        testEnv, sessionCapabilities, sessionId, tags, modulePath, name, host
      }
    };
  }
};
