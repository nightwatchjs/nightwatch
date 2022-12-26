const ProtocolAction = require('./_base-action.js');
const ora = require('ora');

/**
 * Retrieve the URL of the current page or navigate to a new URL.
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.url(function(result) {
 *       // return the current url
 *       console.log(result);
 *     });
 *
 *     // navigate to new url:
 *     browser.url('{URL}');
 *
 *     // navigate to new url:
 *     browser.url('{URL}', function(result) {
 *       console.log(result);
 *     });
 *   }
 * }
 *
 * @link /#navigate-to
 * @syntax .url([url], [callback])
 * @syntax .url(callback)
 * @param {string|function} [url] If missing, it will return the URL of the current page as an argument to the supplied callback.
 * @param {Function} [callback]
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(url, callback = function(r) {return r}) {
    if (typeof url == 'string') {
      let startTime = new Date();
      let spinner;
      if (this.settings.output) {
        spinner = ora({
          text: `Loading url: ${url}\n`,
          prefixText: ' ',
          discardStdin: false
        }).start();
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
};
