const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Mock the geolocation of the browser.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      // Set location of Tokyo, Japan
 *      .setGeolocation({
 *        latitude: 35.689487,
 *        longitude: 139.691706,
 *        accuracy: 100
 *        })
 *      .navigateTo('https://kawasaki-india.com/dealer-locator/');
 *  };
 *
 * @method setGeolocation
 * @syntax .setGeolocation({latitude, longitude, accuracy}, [callback])
 * @param {object} coordinates
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.userprompts
 */
class SetGeolocation extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('SetGeolocation is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {latitude, longitude, accuracy} = this.coordinates;

    if (latitude === undefined && longitude === undefined) {
      // Clear geolocation override.
      this.transportActions
        .clearGeolocation(callback)
        .catch(err => {
          return err;
        })
        .then(result => callback(result));

    } else if (latitude === undefined || longitude === undefined) {
      // Exactly one of them is undefined, throw error.
      const error =  new Error('Please provide both latitude and longitude while using setGeolocation.');
      Logger.error(error);

      return callback(error);

    } else {
      // Both latitude and longitude are provided
      const coordinates = {latitude, longitude, accuracy};

      // Set accuracy as 100 if not provided.
      if (accuracy === undefined) {coordinates.accuracy = 100}

      this.transportActions
        .setGeolocation(coordinates, callback)
        .catch(err => {
          return err;
        })
        .then(result => callback(result));
    }
  }

  command(coordinates, callback) {
    this.coordinates = coordinates || {};

    return super.command(callback);
  }
}

module.exports = SetGeolocation;
