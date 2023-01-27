const ProtocolAction = require('../_base-action.js');

/**
 * Get the current device orientation.
 *
 * @example
 * module.exports = {
 *   'get current device orientation': function (app) {
 *     app
 *       .appium.getOrientation(function (result) {
 *         console.log('current device orientation is:', result.value);
 *       });
 *   },
 *
 *   'get current device orientation with ES6 async/await': async function (app) {
 *     const orientation = await app.appium.getOrientation();
 *     console.log('current device orientation is:', orientation);
 *   }
 * };
 *
 * @syntax .appium.getOrientation([callback])
 * @method getOrientation
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The current device orientation: `LANDSCAPE` or `PORTRAIT`.
 * @see appium.setOrientation
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getScreenOrientation(callback);
  }
};
