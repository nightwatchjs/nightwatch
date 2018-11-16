const Logger = require('../util/logger.js');
const BaseHook = require('./hooks/_basehook.js');

class UnitTest extends BaseHook {
  get isGlobal() {
    return true;
  }

  verifyMethod() {
    return this.context.module[this.key] || null;
  }
}

class TestCase {
  constructor(testName, context, settings, argvOpts = {}) {
    this.testName = testName;
    this.context = context;
    this.settings = settings;
    this.retriesCount = argvOpts.retriesCount;
    this.maxRetries = argvOpts.maxRetries;

    this.print();
    this.startTime = new Date().getTime();
    this.reportKey = `${this.context.moduleKey}/${testName}`;
  }

  print() {
    if (this.settings.output && this.settings.start_session && this.settings.detailed_output && !this.context.unitTestsMode) {
      if (this.retriesCount > 0) {
        console.log('Retrying (' + this.retriesCount + '/' + this.maxRetries + '): ', Logger.colors.red(this.testName));
      } else {
        console.log((this.settings.parallel_mode && !this.settings.live_output ? 'Results for: ' : 'Running: '),
          Logger.colors.green(this.testName) + '\n');
      }
    }

    return this;
  }

  run(api = null) {
    this.api = api;

    try {
      let result;

      if (this.context.unitTestsMode) {
        result = this.runUnitTest();
      } else {
        result = this.context.call(this.testName, this.api);
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

    return unitTest.run(this.api);
  }
}

module.exports = TestCase;