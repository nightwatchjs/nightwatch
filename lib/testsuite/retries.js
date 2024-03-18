class SuiteRetries {
  constructor({ retries = 0, suiteRetries = 0 }) {
    if (typeof retries !== "number" || retries < 0) {
      throw new Error(
        "Invalid retries value. Retries must be a non-negative number."
      );
    }

    if (typeof suiteRetries !== "number" || suiteRetries < 0) {
      throw new Error(
        "Invalid suiteRetries value. Suite retries must be a non-negative number."
      );
    }

    // testcase retries
    this.testMaxRetries = retries;
    this.testRetriesCount = {};

    // suite retries
    this.suiteMaxRetries = suiteRetries;
    this.suiteRetriesCount = 0;
  }

  incrementTestRetriesCount(testName) {
    this.testRetriesCount[testName] =
      (this.testRetriesCount[testName] || 0) + 1;
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
