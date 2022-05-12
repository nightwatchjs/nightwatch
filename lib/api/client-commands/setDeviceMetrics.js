const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Override Device Mode (override the device dimensions).
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .setDeviceMetrics({
 *        width: 400,
 *        height: 600,
 *        deviceScaleFactor: 50,
 *        mobile: true
 *        })
 *      .navigateTo('https://www.google.com');
 *  };
 *
 * @method setDeviceMetrics
 * @syntax .setDeviceMetrics({width, height, deviceScaleFactor, mobile}, [callback])
 * @param {object} metrics
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 */
class SetDeviceMetrics extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('SetDeviceMetrics is not supported while using this driver');
      Logger.error(error);

      return callback(error);
    }

    // The default values below disables the override for that property (if a user
    // has not set a property, they'd want that property to not be overridden).
    const {width=0, height=0, deviceScaleFactor=0, mobile=false} = this.metrics;
    const metrics = {width, height, deviceScaleFactor, mobile};

    this.transportActions
      .setDeviceMetrics(metrics, callback)
      .catch(err => {
        return err;
      })
      .then(result => callback(result));
  }

  command(metrics, callback) {
    this.metrics = metrics || {};

    return super.command(callback);
  }
}

module.exports = SetDeviceMetrics;