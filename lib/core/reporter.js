const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const Screenshots = require('../testsuite/screenshots.js');

class Reporter {
  /**
   * @param {Object} settings
   */
  constructor(settings) {
    this.settings = settings;
    this.screenshots = new Screenshots(settings);
    this.currentTestCase = null;
    this.currentContext = null;
  }

  logAssertResult(test) {
    return this;
  }

  logFailedAssertion(err) {
    Logger.logDetailedMessage(`${Logger.colors.green(Utils.symbols.fail)} ${err.message}`);

    let sections = err.stack.split('\n');
    Logger.logDetailedMessage(`${Logger.colors.stack_trace(sections.join('\n'))} \n`);
  }

  registerPassed(message) {
  }

  registerFailed(err) {
    return this;
  }

  registerTestError(err) {
    if (!this.unitTestsMode) {
      Reporter.logError(err);
    }
  }

  static logError(err) {
    if (!Utils.isErrorObject(err)) {
      if (Utils.isObject(err)) {
        err = Object.keys(err).length > 0 ? JSON.stringify(err) : '';
      }

      err = new Error(err.message || err);
    }

    Logger.error(err);
  }

  ////////////////////////////////////////////////////////////
  // Screenshots
  ////////////////////////////////////////////////////////////
  saveErrorScreenshot(result, saveErrorScreenshot) {
    if (this.settings.screenshots.on_error && saveErrorScreenshot) {
      this.screenshots.saveErrorContent(result, saveErrorScreenshot);

      if (result.lastScreenshotFile) {
        this.addCurrentTestScreenshot(result.lastScreenshotFile);
        delete result.lastScreenshotFile;
      }
    }
  }

  addCurrentTestScreenshot(screenshotFile) {
    return this;
  }
}

module.exports = Reporter;
