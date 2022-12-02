const ProtocolAction = require('./_base-action.js');

/**
 * Set the current geo-location of the mobile device.
 *
 * This command is a part of old [JSON Wire Protocol](https://www.selenium.dev/documentation/legacy/json_wire_protocol/#sessionsessionidlocation), and works with Appium v1 only.
 *
 * @syntax browser.setDeviceGeolocation({latitude, longitude, altitude}, [callback])
 * @method setDeviceGeolocation
 * @param {object} location The new location (`{latitude: number, longitude: number, altitude: number}`).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see getDeviceGeolocation
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(location, callback) {
    return this.transportActions.setDeviceGeolocation(location, callback);
  }
};
