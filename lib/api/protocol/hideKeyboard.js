const ProtocolAction = require('./_base-action.js');

/**
 * Hide soft keyboard.
 *
 * This command works with Appium only.
 *
 * @syntax .hideKeyboard([callback])
 * @method hideKeyboard
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see isKeyboardShown
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.hideDeviceKeyboard({}, callback);
  }
};
