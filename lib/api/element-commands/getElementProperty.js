const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Retrieve the value of a specified DOM property for the given element. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getElementProperty('#login input[type=text]', 'classList', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getElementProperty('css selector', '#login input[type=text]', 'classList', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.getElementProperty({
 *       selector: '#login input[type=text]',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, 'classList', function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getElementProperty('#login input[type=text]', 'classList');
 *     console.log('classList', result);
 *   }
 * }
 *
 * @method getElementProperty
 * @syntax .getElementProperty(selector, property, callback)
 * @syntax .getElementProperty(using, selector, property, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string} property The property to inspect.
 * @param {function} callback Callback function which is called with the result value; not required if using `await` operator.
 * @returns {*} The value of the property
 * @api protocol.elementstate
 * @link /#get-element-property
 */
class GetElementProperty extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'getElementProperty';
  }
}

module.exports = GetElementProperty;
