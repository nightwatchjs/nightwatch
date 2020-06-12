class SuiteRetries {
  constructor({retries = 0, suiteRetries = 0}) {
    // testcase retries
    this.testMaxRetries = retries;
    this.testRetriesCount = {};

    // suite retries
    this.suiteMaxRetries = suiteRetries;
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
