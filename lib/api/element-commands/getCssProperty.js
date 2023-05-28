const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Retrieve the value of a css property for a given DOM element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getCssProperty('#main ul li a.first', 'display', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getCssProperty('css selector', '#main ul li a.first', 'display', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getCssProperty({
 *       selector: '#main ul li a.first',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, 'display', function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getCssProperty('#main ul li a.first', 'display');
 *     console.log('display', result);
 *   }
 * }
 *
 * @method getCssProperty
 * @syntax .getCssProperty(selector, cssProperty, callback)
 * @syntax .getCssProperty(using, selector, cssProperty, callback)
 * @syntax browser.element(selector).getCssProperty(name)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} cssProperty The CSS property to inspect.
 * @param {function} callback Callback function which is called with the result value; not required if using `await` operator.
 * @returns {*} The value of the css property
 * @api protocol.elementstate
 * @link /#get-element-css-value
 */
class GetCssProperty extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'getElementCSSValue';
  }
}

module.exports = GetCssProperty;
