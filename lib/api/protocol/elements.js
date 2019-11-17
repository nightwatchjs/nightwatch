const ProtocolAction = require('./_base-action.js');

/**
 * Search for multiple elements on the page, starting from the document root. The located elements will be returned as web element JSON objects.
 * First argument to be passed is the locator strategy, which is detailed on the [WebDriver docs](https://www.w3.org/TR/webdriver/#locator-strategies).
 *
 * The locator strategy can be one of:
 * - `css selector`
 * - `link text`
 * - `partial link text`
 * - `tag name`
 * - `xpath`
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.elements('css selector', 'ul li', function(result) {
 *       console.log(result.value)
 *     });
 *   },
 *
 *   'es6 async demo Test': async function(browser) {
 *     const result = await browser.elements('css selector', 'ul li');
 *     console.log('result value is:', result.value);
 *   },
 *
 *   'page object demo Test': function (browser) {
 *      var nightwatch = browser.page.nightwatch();
 *      nightwatch
 *        .navigate()
 *        .assert.titleContains('Nightwatch.js');
 *
 *      nightwatch.api.elements('@featuresList', function(result) {
 *        console.log(result);
 *      });
 *
 *      browser.end();
 *   }
 * }
 *
 * @link /#find-elements
 * @syntax .elements(using, value, callback)
 * @editline L734
 * @param {string|null} using The locator strategy to use.
 * @param {string} value The search target.
 * @param {function} callback Callback function to be invoked with the result when the command finishes.
 * @api protocol.elements
 */
const Element = require('../../element');

module.exports = class Elements extends ProtocolAction {
  command(using, value, callback) {
    const commandName = 'elements';

    if (using instanceof Element) {
      return this.findElements({
        element: using,
        callback: value,
        commandName
      });
    }

    return this.findElements({
      using, value, commandName, callback
    });
  }
};
