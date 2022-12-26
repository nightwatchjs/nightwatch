const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Mock the geolocation of the browser. Call without any arguments to reset the geolocation back to original.
 *
 * This command also supports mocking the geolocation of mobile devices (when automated using Appium), with a few caveats:
 * - It accepts `{latitude: number, longitude: number, altitude: number}` as the first argument with `altitude` as optional.
 * - Calling the command without any argument does not reset the geolocation of the mobile device.
 *
 * @example
 *  describe('mock geolocation', function() {
 *    it('sets the geolocation to Tokyo, Japan and then resets it', () => {
 *      browser
 *        .setGeolocation({
 *          latitude: 35.689487,
 *          longitude: 139.691706,
 *          accuracy: 100
 *        })  // sets the geolocation to Tokyo, Japan
 *        .navigateTo('https://www.gps-coordinates.net/my-location')
 *        .pause(3000)
 *        .setGeolocation()  // resets the geolocation
 *        .navigateTo('https://www.gps-coordinates.net/my-location')
 *        .pause(3000);
 *    });
 *  });
 *
 * @method setGeolocation
 * @syntax .setGeolocation({latitude, longitude, accuracy|altitude}, [callback])
 * @param {object} [coordinates] `latitude` and `longitude` are required; `accuracy` is optional for desktop browsers, and `altitude` is optional for mobile devices.
 * @param {function} [callback] Callback function to be called when the command finishes.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/network-requests/mock-geolocation.html
 */
class SetGeolocation extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    // TODO: use better predicate to find out if Appium is being used.
    if (this.api.browserName === null) {
      return this.transportActions.setDeviceGeolocation(this.coordinates, callback);
    }

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('The command .setGeolocation() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {latitude, longitude, accuracy} = this.coordinates;

    if (latitude !== undefined && longitude !== undefined) {
      // Both latitude and longitude are provided

      const coordinates = {latitude, longitude, accuracy};
      // Set accuracy as 100 if not provided.
      if (accuracy === undefined) {coordinates.accuracy = 100}

      this.transportActions
        .setGeolocation(coordinates, callback)
        .catch(err => {
          Logger.error(err);
          callback(err);
        });

      return;
    }

    if (latitude === undefined && longitude === undefined) {
      // Clear geolocation override.
      this.transportActions
        .clearGeolocation(callback)
        .catch(err => {
          Logger.error(err);
          callback(err);
        });

      return;
    }

    // Exactly one of them is undefined, throw error.
    const error =  new Error('Please provide both latitude and longitude while using setGeolocation.');
    Logger.error(error);

    return callback(error);
  }

  command(coordinates, callback) {
    this.coordinates = coordinates || {};

    return super.command(callback);
  }
}

module.exports = SetGeolocation;
