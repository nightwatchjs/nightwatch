const Logger = require('../util/logger.js');

class TestCase {
  constructor(currentTest, context, settings, addtOpts = {}) {
    this.currentTest = currentTest;
    this.context = context;
    this.settings = settings;
    this.addtOpts = addtOpts;
    this.retriesCount = this.addtOpts.retriesCount;
    this.maxRetries = this.addtOpts.maxRetries;
    this.startTime = null;
  }

  print() {
    if (this.settings.output && this.settings.start_session && this.settings.detailed_output) {
      process.stdout.write('\n');

      if (this.retriesCount > 0) {
        console.log('Retrying (' + this.retriesCount + '/' + this.maxRetries + '): ',
          Logger.colors.red(this.currentTest));
      } else {
        console.log((this.addtOpts.parallelMode && !this.settings.live_output ? 'Results for: ' : 'Running: '),
          Logger.colors.green(this.currentTest));
      }
    }

    return this;
  }

  run(api = null) {
    this.api = api;
    this.startTime = new Date().getTime();

    try {
      if (this.settings.start_session) {
        let result = this.context.call(this.currentTest, this.api);

        return this.api;
      } else {
        // TODO: implement support for unit tests
      }
    } catch (err) {
      console.log('TEST ERR', err);

      return false;
    }

  }
}

module.exports = TestCase;