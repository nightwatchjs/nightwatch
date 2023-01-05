const ProtocolAction = require('../_base-action.js');

/**
 * Get the name of the current Android activity.
 *
 * @example
 * module.exports = {
 *   'get current activity name': function (app) {
 *     app
 *       .appium.getCurrentActivity(function (result) {
 *         console.log('current android activity is:', result.value);
 *       });
 *   },
 *
 *   'get current activity name with ES6 async/await': async function (app) {
 *     const activity = await app.appium.getCurrentActivity();
 *     console.log('current android activity is:', activity);
 *   }
 * };
 *
 * @syntax .appium.getCurrentActivity([callback])
 * @method getCurrentActivity
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} Name of the current activity.
 * @see appium.getCurrentPackage
 * @see appium.startActivity
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentActivity(callback);
  }
};
