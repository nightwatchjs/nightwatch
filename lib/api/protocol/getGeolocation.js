const ProtocolAction = require('./_base-action.js');

/**
 * Get the current geolocation of the mobile device.
 * 
 * This command works with Appium only. Getting the current geolocation for desktop browsers is not supported.
 *
 * @syntax .getGeolocation([callback])
 * @method getGeolocation
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {object} The current geolocation: `{latitude: number, longitude: number, altitude: number}`.
 * @see setGeolocation
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getDeviceGeolocation(callback);
  }
};
