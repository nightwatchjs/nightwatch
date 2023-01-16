const Utils = require('../utils');
const {Logger} = Utils;

class SimplifiedReporter {
  static logError(err) {
    if (!Utils.isErrorObject(err)) {
      if (Utils.isObject(err)) {
        err = Object.keys(err).length > 0 ? JSON.stringify(err) : '';
      }

      err = new Error(err.message || err);
    }

    Logger.error(err);
  }

  get currentTestCase() {
    return null;
  }

  /**
   * @param {Object} settings
   */
  constructor(settings) {
    this.settings = settings;
    this.currentContext = null;
  }

  logAssertResult(test) {
    return this;
  }

  /**
   * @param {Object} result
   */
  logCommandResult(node, result) {
    return this;
  }

  logFailedAssertion(err) {
    Logger.logDetailedMessage(`  ${Logger.colors.red(Utils.symbols.fail)} ${err.message}`);

    let sections = err.stack.split('\n');
    Logger.logDetailedMessage(`${Logger.colors.stack_trace(sections.join('\n'))} \n`);
  }

  registerPassed(message) {
    Logger.logDetailedMessage(`${Logger.colors.green(Utils.symbols.ok)} ${message}`);
  }

  registerFailed(err) {
    return this;
  }

  registerTestError(err) {}
  saveErrorScreenshot(result, screenshotContent) {}
}

module.exports = SimplifiedReporter;
