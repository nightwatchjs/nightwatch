const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve the current window handle.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.windowHandle(function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @link /#get-window-handle
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.window
 * @deprecated In favour of `.window.getHandle()`.
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.getWindowHandle(callback);
  }
};
