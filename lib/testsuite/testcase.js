const BaseHook = require('./hooks/_basehook.js');
const {Logger} = require('../utils');

class UnitTest extends BaseHook {
  get isGlobal() {
    return true;
  }

  get isUnitTest() {
    return true;
  }

  verifyMethod() {
    return this.context.getKey(this.key) || null;
  }
}

class TestCase {
  constructor(testName, {context, settings, reporter, options = {}}) {
    this.testName = testName;
    this.context = context;
    this.reporter = reporter;
    this.settings = settings;
    this.retriesCount = options.retriesCount;
    this.maxRetries = options.maxRetries;

    this.print();
    this.startTime = new Date().getTime();
    this.reportKey = `${this.context.moduleKey}/${testName}`;
  }

  print() {
    const {output, detailed_output} = this.settings;

    if (output && detailed_output && !this.context.unitTestsMode) {
      const {colors} = Logger;

      if (this.retriesCount > 0) {
        // eslint-disable-next-line no-console
        console.log('Retrying (' + this.retriesCount + '/' + this.maxRetries + '): ', colors.red(this.testName));
      } else {
        this.reporter.logTestCase(this.testName);
      }
    }

    return this;
  }

  run(client = null) {
    this.client = client;

    try {
      let result;

      if (this.context.unitTestsMode) {
        result = this.runUnitTest();
      } else {
        result = this.context.call(this.testName, this.client);
      }

      return result;
    } catch (err) {
      return Promise.reject(err);
    }

  }

  runUnitTest() {
    let unitTest = new UnitTest(this.testName, this.context, {
      asyncHookTimeout: this.settings.globals.unitTestsTimeout
    });

    return unitTest.run(this.client);
  }
}

module.exports = TestCase;
