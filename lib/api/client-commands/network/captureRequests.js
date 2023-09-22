const ClientCommand = require('../_base-command.js');
const {Logger} = require('../../../utils');

/**
 * Capture outgoing network calls from the browser.
 *
 * @example
 *  describe('capture network requests', function() {
 *    it('captures and logs network requests as they occur', function(this: ExtendDescribeThis<{requestCount: number}>) {
 *      this.requestCount = 1;
 *      browser
 *        .network.captureRequests((requestParams) => {
 *          console.log('Request Number:', this.requestCount!++);
 *          console.log('Request URL:', requestParams.request.url);
 *          console.log('Request method:', requestParams.request.method);
 *          console.log('Request headers:', requestParams.request.headers);
 *        })
 *        .navigateTo('https://www.google.com');
 *    });
 *  });
 *
 * @method network.captureRequests
 * @syntax .captureNetworkRequests(onRequestCallback)
 * @syntax .network.captureRequests(onRequestCallback)
 * @param {function} onRequestCallback Callback function called whenever a new outgoing network request is made.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/network-requests/capture-network-calls.html
 */
class CaptureNetworkCalls extends ClientCommand {

  static get namespacedAliases() {
    return 'captureNetworkRequests';
  }

  performAction(callback) {

    if (!this.api.isChrome() && !this.api.isEdge()) {
      const error = new Error('The command .captureNetworkRequests() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const userCallback = this.userCallback;
    if (userCallback === undefined) {
      const error =  new Error('Callback is missing from .captureNetworkRequests() command.');
      Logger.error(error);

      return callback(error);
    }

    this.transportActions.interceptNetworkCalls(userCallback, callback);
  }

  command(userCallback, callback) {
    this.userCallback = userCallback;

    return super.command(callback);
  }
}

module.exports = CaptureNetworkCalls;
