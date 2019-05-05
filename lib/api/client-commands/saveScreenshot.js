const ClientCommand = require('./_baseCommand.js');
const Screenshots = require('../../testsuite/screenshots.js');

/**
 * Take a screenshot of the current page and saves it as the given filename.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.saveScreenshot('/path/to/fileName.png');
 *  };
 *
 *
 * @method saveScreenshot
 * @param {string} fileName The complete path to the file name where the screenshot should be saved.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see screenshot
 * @api protocol.screens
 */
class SaveScreenshot extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    const {fileName} = this;

    this.api.screenshot(this.api.options.log_screenshot_data, function(result) {
      Screenshots.writeScreenshotToFile(fileName, result.value, err => {
        callback.call(this, result);
      });
    });
  }

  command(fileName, callback) {
    this.fileName = fileName;

    return super.command(callback);
  }
}

module.exports = SaveScreenshot;
