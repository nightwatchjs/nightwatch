const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve the list of all window handles available to the session.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.windowHandles(function(result) {
 *      // An array of window handles.
 *      console.log(result.value);
 *    });
 * }
 *
 * @link /#get-window-handles
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.window
 * @deprecated In favour of `.window.getAllHandles()`.
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.getAllWindowHandles(callback);
  }
};
