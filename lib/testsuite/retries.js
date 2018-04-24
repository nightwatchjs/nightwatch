class SuiteRetries {
  constructor(argvOpts = {}) {
    // testcase retries
    this.testMaxRetries = argvOpts.retries || 0;
    this.testRetriesCount = {};

    // suite retries
    this.suiteMaxRetries = argvOpts.suiteRetries || 0;
    this.suiteRetriesCount = 0;
  }

  incrementTestRetriesCount(testName) {
    this.testRetriesCount[testName] = this.testRetriesCount[testName] || 0;
    this.testRetriesCount[testName]++;
  }

  incrementSuiteRetriesCount() {
    this.suiteRetriesCount++;
  }

  shouldRetryTest(testName) {
    if (this.testMaxRetries === 0) {
      return false;
    }

    this.testRetriesCount[testName] = this.testRetriesCount[testName] || 0;

    return this.testRetriesCount[testName] < this.testMaxRetries;
  }

  shouldRetrySuite() {
    return this.suiteRetriesCount < this.suiteMaxRetries;
  }
}

module.exports = SuiteRetries;