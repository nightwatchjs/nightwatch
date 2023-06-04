const ClientCommand = require('./_base-command.js');
const {Logger, writeToFile} = require('../../utils');
const {COMMON_EVENTS: {ScreenshotCreated}, NightwatchEventHub} = require('../../runner/eventHub.js');

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
  performAction(callback) {
    const {fileName, client} = this;

    this.api.screenshot(this.api.options.log_screenshot_data, function(result) {
      if (client.transport.isResultSuccess(result) && result.value) {
        writeToFile(fileName, result.value, 'base64').then(() => {
          callback.call(this, result);

          NightwatchEventHub.emit(ScreenshotCreated, {
            path: fileName
          });
        }).catch(err => {
          Logger.error(`Couldn't save screenshot to "${fileName}":`);
          Logger.error(err);
          callback.call(this, result);
        });
      } else {
        Logger.error(`Couldn't save screenshot to "${fileName}":`);
        callback.call(this, result);
      }
    });
  }

  command(fileName, callback) {
    this.fileName = fileName;

    return super.command(callback);
  }
}

module.exports = SaveScreenshot;
