const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve the URL of the current page.
 *
 * @example
 * describe('Navigation commands demo', function() {
 *   test('demoTest', function(browser) {
 *     // navigate to new url:
 *     browser.navigateTo('https://nightwatchjs.org');
 *
 *     // Retrieve to url with callback:
 *     browser.getCurrentUrl(function(result) {
 *       console.log(result.value);
 *     });
 *   });
 *
 *   test('demoTestAsync', async function(browser) {
 *     const currentUrl = await browser.navigateTo('https://nightwatchjs.org').getCurrentUrl();
 *     console.log('currentUrl:', currentUrl); // will print 'https://nightwatchjs.org'
 *   });
 *
 * });
 *
 * @method getCurrentUrl
 * @link /#get-current-url
 * @syntax .getCurrentUrl([callback])
 * @param {Function} [callback]
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  command(callback = function(r) {return r}) {
    return this.transportActions.getCurrentUrl().then(result => {
      return callback.call(this.api, result);
    });
  }
};
