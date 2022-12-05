const ProtocolAction = require('./_base-action.js');

/**
 * Get the current geolocation of the mobile device. Getting the current geolocation for desktop browsers is not supported.
 *
 * This command is a part of old [JSON Wire Protocol](https://www.selenium.dev/documentation/legacy/json_wire_protocol/#sessionsessionidlocation), and works with Appium v1 only.
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
