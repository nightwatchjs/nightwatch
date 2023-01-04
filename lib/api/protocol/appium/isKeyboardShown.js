const ProtocolAction = require('../_base-action.js');

/**
 * Whether or not the soft keyboard is shown.
 *
 * @syntax .appium.isKeyboardShown([callback])
 * @method isKeyboardShown
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {boolean} True if the keyboard is shown.
 * @see appium.hideKeyboard
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.isDeviceKeyboardShown(callback);
  }
};
