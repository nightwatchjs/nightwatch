const Logger = require('../util/logger.js');

class TestCase {
  constructor(testName, context, settings, addtOpts = {}) {
    this.testName = testName;
    this.context = context;
    this.settings = settings;
    this.addtOpts = addtOpts;
    this.retriesCount = this.addtOpts.retriesCount;
    this.maxRetries = this.addtOpts.maxRetries;

    this.print();
    this.startTime = new Date().getTime();
    this.reportKey = `${this.context.moduleKey}/${testName}`;
  }

  print() {
    if (this.settings.output && this.settings.start_session && this.settings.detailed_output) {
      process.stdout.write('\n');

      if (this.retriesCount > 0) {
        console.log('Retrying (' + this.retriesCount + '/' + this.maxRetries + '): ', Logger.colors.red(this.testName));
      } else {
        console.log((this.addtOpts.parallelMode && !this.settings.live_output ? 'Results for: ' : 'Running: '),
          Logger.colors.green(this.testName));
      }
    }

    return this;
  }

  run(api = null) {
    this.api = api;

    try {
      if (this.settings.start_session) {
        let result = this.context.call(this.testName, this.api);

        return this.api;
      } else {
        // TODO: implement support for unit tests
      }
    } catch (err) {
      // TODO: log error
      console.error('Testcase ERROR:', err);

      return false;
    }

  }
}

module.exports = TestCase;