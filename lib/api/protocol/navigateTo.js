const {Logger} = require('../../utils');
const ProtocolAction = require('./_base-action.js');

/**
 * Navigate to a new URL.
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
 * @method navigateTo
 * @link /#navigate-to
 * @syntax .navigateTo(url, [callback])
 * @param {string} url The url to navigate to
 * @param {Function} [callback]
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  command(url, callback = function(r) {return r}) {
    if (typeof url != 'string') {
      throw new Error('Missing url parameter.');
    }

    if (!(url.startsWith('http://') || url.startsWith('https://')) && this.api.launchUrl) {
      url = this.api.launchUrl + url;
      // remove double slashes in url
      url = url.split('://').map(i => i.replace('//', '/')).join('://');
    }

    return this.transportActions.navigateTo(url)
      .then((result) => {
        return callback.call(this.api, result);
      })
      .then(async (result) => {
        try {
          await this.settings.globals.onBrowserNavigate(this.api);
        } catch (err) {
          const error = new Error(`Error during onBrowserNavigate() global hook: ${err.message}`);
          Logger.error(error);
        }

        return result;
      });
  }
};
