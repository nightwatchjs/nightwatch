const ProtocolAction = require('./_base-action.js');

/**
 * Get the current geo-location of the mobile device.
 *
 * This command is a part of old [JSON Wire Protocol](https://www.selenium.dev/documentation/legacy/json_wire_protocol/#sessionsessionidlocation), and works with Appium v1 only.
 *
 * @syntax browser.getDeviceGeolocation([callback])
 * @method getDeviceGeolocation
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {object} The current geo-location: `{latitude: number, longitude: number, altitude: number}`.
 * @see setDeviceGeolocation
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getDeviceGeolocation(callback);
  }
};
