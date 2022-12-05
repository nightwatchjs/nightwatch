const ProtocolAction = require('./_base-action.js');

/**
 * Whether or not the soft keyboard is shown.
 *
 * This command works with Appium only.
 *
 * @syntax .isKeyboardShown([callback])
 * @method isKeyboardShown
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {boolean} True if the keyboard is shown.
 * @see hideKeyboard
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.isDeviceKeyboardShown(callback);
  }
};
