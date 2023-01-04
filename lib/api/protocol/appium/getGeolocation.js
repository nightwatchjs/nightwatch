const ProtocolAction = require('../_base-action.js');

/**
 * Get the current geolocation of the mobile device.
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
