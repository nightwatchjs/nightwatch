class Results {
  constructor(tests = []) {
    this.steps = tests.slice(0);

    this.initCount();
  }

  get passedCount() {
    return this.__passed;
  }

  get failedCount() {
    return this.__failed;
  }

  get errorsCount() {
    return this.__errors;
  }

  get skippedCount() {
    return this.__skipped;
  }

  get testsCount() {
    return this.__tests;
  }

  get testcases() {
    return this.__testcases;
  }

  get time() {
    return this.__time;
  }

  initCount() {
    this.__passed = 0;
    this.__failed = 0;
    this.__errors = 0;
    this.__skipped = 0;
    this.__tests = 0;
    this.__testcases = {};
    this.__timestamp = new Date().toUTCString();
    this.__time = 0;
  }

  setCurrentTest(testName = '') {
    let index = this.steps.indexOf(testName);
    if (index > -1) {
      this.steps.splice(index, 1);
    }

    return this;
  }
}

module.exports = Results;