const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Override Device Mode (overrides device dimensions).
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .setDeviceDimensions({
 *        width: 400,
 *        height: 600,
 *        deviceScaleFactor: 50,
 *        mobile: true
 *        })
 *      .navigateTo('https://www.google.com');
 *  };
 *
 * @method setDeviceDimensions
 * @syntax .setDeviceDimensions({width, height, deviceScaleFactor, mobile}, [callback])
 * @param {object} metrics
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.mobile
 */
class SetDeviceDimensions extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('SetDeviceDimensions is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    // The default values below disables the override for that property (if a user
    // has not set a property, they'd want that property to not be overridden).
    const {width = 0, height = 0, deviceScaleFactor = 0, mobile = false} = this.metrics;
    const metrics = {width, height, deviceScaleFactor, mobile};

    this.transportActions
      .setDeviceMetrics(metrics, callback)
      .catch(err => {
        Logger.error(err);
        callback(err);
      });
  }

  command(metrics, callback) {
    this.metrics = metrics || {};

    return super.command(callback);
  }
}

module.exports = SetDeviceDimensions;