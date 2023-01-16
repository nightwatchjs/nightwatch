const {Logger, relativeUrl, uriJoin} = require('../../utils');
const ProtocolAction = require('./_base-action.js');

/**
 * Navigate to a new URL. This method will also call the `onBrowserNavigate()` test global, right after the page is loaded.
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
 * @since 2.0.0
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(url, callback = function(r) {return r}) {
    if (typeof url != 'string') {
      throw new Error('Missing url parameter.');
    }

    if (relativeUrl(url)) {
      if (!this.api.baseUrl) {
        throw new Error(`Invalid URL ${url}. When using relative uris, you must ` +
          'define a "baseUrl" or "launchUrl" in your nightwatch config.');
      }

      url = uriJoin(this.api.baseUrl, url);
    }

    return this.transportActions.navigateTo(url)
      .then((result) => {
        if (result && result.error) {
          const {error} = result;
          const {message} = error;

          error.message = `Unable to navigate to url ${url}: ${message}`;

          throw error;
        }

        return callback.call(this.api, result);
      })
      .then(async (result) => {
        try {
          await this.settings.globals.onBrowserNavigate(this.api, result);
        } catch (err) {
          const error = new Error(`Error during onBrowserNavigate() global hook: ${err.message}`);
          Logger.error(error);
        }

        return result;
      });
  }
};
