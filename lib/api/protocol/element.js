const ProtocolAction = require('./_base-action.js');

/**
 * Search for an element on the page, starting from the document root. The located element will be returned as a web element JSON object.
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
 *     browser.element('css selector', 'body', function(result) {
 *       console.log(result.value)
 *     });
 *   },
 *
 *   'es6 async demo Test': async function(browser) {
 *     const result = await browser.element('css selector', 'body');
 *     console.log('result value is:', result.value);
 *   }
 * }
 *
 * // Example with using page object elements
 * module.exports = {
 *  'demo Test with page object' : function(browser) {
 *     const loginPage = browser.page.login();
 *     loginPage.api.element('@resultContainer', function(result) {
 *       console.log(result.value)
 *     });
 *   }
 * }
 *
 *
 * @link /#find-element
 * @syntax .element(using, value, callback)
 * @editline L680
 * @deprecated
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elements
 */
const {By} = require('selenium-webdriver');
const Element = require('../../element');

module.exports = class Session extends ProtocolAction {
  reportProtocolErrors(result) {
    return result.code && result.message;
  }

  command(using, value, callback) {
    const commandName = 'element';

    if (using instanceof Element || using instanceof By) {
      return this.findElements({
        element: using,
        callback: typeof value == 'function' ? value : callback,
        commandName
      });
    }

    return this.findElements({
      using, value, commandName, callback
    });
  }
};
