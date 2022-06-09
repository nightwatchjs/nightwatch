const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Enable the collection of performance metrics in the browser.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .enablePerformanceMetrics()
 *      .navigateTo('https://www.google.com');
 *      .getPerformanceMetrics((metrics) => {
 *        console.log(metrics);
 *       });
 *  };
 *
 * @method enablePerformanceMetrics
 * @syntax .enablePerformanceMetrics([enable, callback])
 * @param {boolean} [enable] Optional Whether to enable or disable the performance metrics collection. Default: true
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.userprompts
 */
class EnablePerformanceMetrics extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('EnablePerformanceMetrics is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {enable = true} = this;
    
    this.transportActions
      .enablePerformanceMetrics(enable, callback)
      .catch(err => {
        return err;
      })
      .then(result => callback(result));
  }

  command(enable, callback) {
    this.enable = enable;

    return super.command(callback);
  }
}

module.exports = EnablePerformanceMetrics;
