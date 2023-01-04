const ProtocolAction = require('../_base-action.js');

/**
 * Set the current geolocation of the mobile device.
 *
 * @syntax .appium.setGeolocation({latitude, longitude, altitude}, [callback])
 * @method setGeolocation
 * @param {object} [coordinates] `latitude` and `longitude` are required; `altitude` is optional. All should be of type `number`.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see appium.getGeolocation
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(coordinates = {}, callback) {
    if (!('latitude' in coordinates && 'longitude' in coordinates)) {
      throw new Error('Please provide both latitude and longitude while using setGeolocation.');
    }

    return this.transportActions.setDeviceGeolocation(coordinates, callback);
  }
};
