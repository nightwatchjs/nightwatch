const ProtocolAction = require('./_base-action.js');
const ora = require('ora');

/**
 * Retrieve the URL of the current page or navigate to a new URL, with an option to capture HTTP headers.
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.url('{URL}', {captureHeaders: true}, function(result) {
 *       // access headers after page loads
 *       const headers = browser.getHeaders();
 *       console.log(headers);
 *     });
 *   }
 * }
 *
 * @method url
 * @link /#navigate-to
 * @syntax .url([url], [options], [callback])
 * @syntax .url(callback)
 * @param {string|function} [url] If missing, it will return the URL of the current page as an argument to the supplied callback.
 * @param {Object} [options] Options to configure the behavior.
 * @param {boolean} [options.captureHeaders] If `true`, captures HTTP response headers for the page.
 * @param {Function} [callback]
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(url, options = {}, callback = function(r) { return r }) {
    const {captureHeaders} = options;

    if (typeof url == 'string') {
      const startTime = new Date();
      let spinner;
      if (this.settings.output) {
        spinner = ora({
          text: `Loading url: ${url}\n`,
          prefixText: ' ',
          discardStdin: false
        }).start();
      }

      if (captureHeaders) {
        this.captureHeaders(url);  // Capture headers if the flag is set
      }

      return this.transportActions.navigateTo(url).then(result => {
        if (spinner) {
          const ms = new Date() - startTime;
          spinner.info(`Loaded url ${url} in ${ms}ms`);
        }

        return callback.call(this.api, result);
      });
    }

    if (typeof url == 'function') {
      callback = url;
    }

    return this.transportActions.getCurrentUrl().then(result => {
      return callback.call(this.api, result);
    });
  }

  // New method to capture headers from the network request
  captureHeaders(url) {
    const client = this.api.client;

    client.send('Network.enable'); // Enable the network domain
    let responseHeaders = null;

    // Listen for network response events to capture headers
    client.on('Network.responseReceived', (params) => {
      if (params.response.url === url) {
        responseHeaders = params.response.headers;
      }
    });

    // Store headers in the api object
    this.api.capturedHeaders = responseHeaders;
  }

  // New method to retrieve captured headers
  getHeaders() {
    return this.api.capturedHeaders;
  }
};
