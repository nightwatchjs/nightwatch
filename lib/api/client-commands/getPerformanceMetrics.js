const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Get the performance metrics from the browser. Metrics collection only begin after `enablePerformanceMetrics()` command is called.
 *
 * @example
 *  describe('collect performance metrics', function() {
 *    it('enables the metrics collection, does some stuff and collects the metrics', function() {
 *      browser
 *        .enablePerformanceMetrics()
 *        .navigateTo('https://www.google.com')
 *        .getPerformanceMetrics((result) => {
 *          if (result.status === 0) {
 *            const metrics = result.value;
 *            console.log(metrics);
 *          }
 *        });
 *    });
 *  });
 *
 * @method getPerformanceMetrics
 * @syntax .getPerformanceMetrics(callback)
 * @param {function} callback Callback function called with an object containing the performance metrics as argument.
 * @returns {Promise<object>} Metrics collected between the last call to `enablePerformanceMetrics()` command and this command.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo web.dev/metrics/
 * @moreinfo pptr.dev/api/puppeteer.page.metrics/
 */
class GetPerformanceMetrics extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('The command .getPerformanceMetrics() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }
    
    this.transportActions
      .getPerformanceMetrics(callback)
      .catch(err => {
        Logger.error(err);
        callback(err);
      });
  }

  command(callback) {
    return super.command(callback);
  }
}

module.exports = GetPerformanceMetrics;
