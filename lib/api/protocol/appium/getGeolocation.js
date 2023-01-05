const ProtocolAction = require('../_base-action.js');

/**
 * Get the current geolocation of the mobile device.
 *
 * @example
 * module.exports = {
 *   'get device geolocation': function (app) {
 *     app
 *       .appium.getGeolocation(function (result) {
 *         console.log('current device geolocation is:', result.value);
 *       });
 *   },
 *
 *   'get device geolocation with ES6 async/await': async function (app) {
 *     const location = await app.appium.getGeolocation();
 *     console.log('current device geolocation is:', location);
 *   }
 * };
 *
 * @syntax .appium.getGeolocation([callback])
 * @method getGeolocation
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {object} The current geolocation: `{latitude: number, longitude: number, altitude: number}`.
 * @see appium.setGeolocation
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getDeviceGeolocation(callback);
  }
};
