class SuiteRetries {
  constructor(addtOpts = {}) {
    // testcase retries
    this.testMaxRetries = addtOpts.retries || 0;
    this.testRetriesCount = 0;

    // suite retries
    this.suiteMaxRetries = addtOpts.suite_retries || 0;
    this.suiteRetriesCount = 0;
  }

  incrementTestRetriesCount() {
    this.testRetriesCount++;
  }

  incrementSuiteRetriesCount() {
    this.testRetriesCount++;
  }

  shouldRetryTest() {
    return this.testRetriesCount < this.testMaxRetries;
  }

  shouldRetrySuite() {
    return this.suiteRetriesCount < this.suiteMaxRetries;
  }
}

module.exports = SuiteRetries;