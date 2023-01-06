const ProtocolAction = require('../_base-action.js');

/**
 * Whether or not the soft keyboard is shown.
 *
 * @example
 * module.exports = {
 *   'whether keyboard is shown': function (app) {
 *     app
 *       .appium.isKeyboardShown(function (result) {
 *         console.log('result value of whether keyboard is shown:', result.value);
 *       });
 *   },
 *
 *   'whether keyboard is shown with ES6 async/await': async function (app) {
 *     const result = await app.appium.isKeyboardShown();
 *     console.log('result value of whether keyboard is shown:', result);
 *   }
 * };
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
