const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Retrieve the value of an attribute for a given DOM element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getAttribute('#main ul li a.first', 'href', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getAttribute('css selector', '#main ul li a.first', 'href', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getAttribute({
 *       selector: '#main ul li a.first',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, 'href', function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getAttribute('#main ul li a.first', 'href');
 *     console.log('attribute', result);
 *   }
 * }
 *
 * @method getAttribute
 * @syntax .getAttribute(selector, attribute, callback)
 * @syntax .getAttribute(using, selector, attribute, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} attribute The attribute name to inspect.
 * @param {function} callback Callback function which is called with the result value; not required if using `await` operator.
 * @returns {*} The value of the attribute
 * @api protocol.elementstate
 * @link /#dfn-get-element-attribute
 */
class GetAttribute extends BaseElementCommand {
  static get AliasName() {
    return 'getElementAttribute';
  }

  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'getElementAttribute';
  }
}

module.exports = GetAttribute;
