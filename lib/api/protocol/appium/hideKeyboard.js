const ProtocolAction = require('../_base-action.js');

/**
 * Hide soft keyboard.
 *
 * @syntax .appium.hideKeyboard([callback])
 * @method hideKeyboard
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see appium.isKeyboardShown
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.hideDeviceKeyboard({}, callback);
  }
};
