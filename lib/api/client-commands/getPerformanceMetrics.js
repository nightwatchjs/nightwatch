const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Get the performance metrics from the browser.
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
 * @method getPerformanceMetrics
 * @syntax .getPerformanceMetrics(callback)
 * @param {function} callback Callback function which is called with the performance metrics as argument.
 * @api protocol.userprompts
 * @returns {object} Performance metrics 
 */
class GetPerformanceMetrics extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('GetPerformanceMetrics is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }
    
    this.transportActions
      .getPerformanceMetrics(callback)
      .catch(err => {
        return err;
      });
  }

  command(callback) {
    return super.command(callback);
  }
}

module.exports = GetPerformanceMetrics;
