const ProtocolAction = require('../_base-action.js');

/**
 * Hide soft keyboard.
 *
 * @example
 * module.exports = {
 *   'hide device soft keyboard': function (app) {
 *     app
 *       .appium.hideKeyboard();
 *   },
 *
 *   'hide device soft keyboard with ES6 async/await': async function (app) {
 *     await app.appium.hideKeyboard();
 *   }
 * };
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
