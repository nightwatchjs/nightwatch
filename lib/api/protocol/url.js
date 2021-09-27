const ProtocolAction = require('./_base-action.js');

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
  command(url, callback = function(r) {return r}) {
    if (typeof url == 'string') {
      return this.transportActions.navigateTo(url).then(result => {
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
