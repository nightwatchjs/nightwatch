const ProtocolAction = require('../_base-action.js');

/**
 * Get the name of the current Android package.
 *
 * @example
 * module.exports = {
 *   'get current package name': function (app) {
 *     app
 *       .appium.getCurrentPackage(function (result) {
 *         console.log('current android package is:', result.value);
 *       });
 *   },
 *
 *   'get current package name with ES6 async/await': async function (app) {
 *     const packageName = await app.appium.getCurrentPackage();
 *     console.log('current android package is:', packageName);
 *   }
 * };
 *
 * @syntax .appium.getCurrentPackage([callback])
 * @method getCurrentPackage
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} Name of the current package.
 * @see appium.getCurrentActivity
 * @see appium.startActivity
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentPackage(callback);
  }
};
