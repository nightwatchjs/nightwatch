const ProtocolAction = require('./_base-action.js');

/**
 * Take a screenshot of the current page.
 *
 * @link /#take-screenshot
 * @param {boolean} log_screenshot_data Whether or not the screenshot data should appear in the logs when running with --verbose
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.screens
 */
module.exports = class Session extends ProtocolAction {
  command(log_screenshot_data = false, callback = function (r) {return r}) {
    if (arguments.length === 1 && typeof arguments[0] === 'function') {
      return this.transportActions.getScreenshot(false, arguments[0]);
    }

    return this.transportActions.getScreenshot(log_screenshot_data, callback);
  }
};
