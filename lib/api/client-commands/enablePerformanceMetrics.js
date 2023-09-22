const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Enable/disable the collection of performance metrics in the browser. Metrics collection only begin after this command is called.
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
 * @method enablePerformanceMetrics
 * @syntax .enablePerformanceMetrics([enable], [callback])
 * @param {boolean} [enable] Whether to enable or disable the performance metrics collection. Default: `true`.
 * @param {function} [callback] callback function to be called when the command finishes.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo web.dev/metrics/
 * @moreinfo pptr.dev/api/puppeteer.page.metrics/
 */
class EnablePerformanceMetrics extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome() && !this.api.isEdge()) {
      const error = new Error('The command .enablePerformanceMetrics() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {enable = true} = this;

    this.transportActions.enablePerformanceMetrics(enable, callback);
  }

  command(enable, callback) {
    this.enable = enable;

    return super.command(callback);
  }
}

module.exports = EnablePerformanceMetrics;
