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
  command(log_screenshot_data = false, callback = function() {}) {
    return this.transportActions.getScreenshot(log_screenshot_data, callback);
  }
};
