const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Set the value of a specified DOM attribute for the given element. For all the available DOM attributes, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.setAttribute('#login input[type=text]', 'disabled', 'true', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.setAttribute('css selector', '#login input[type=text]', 'disabled', 'true', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.setAttribute({
 *       selector: '#login input[type=text]',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, 'disabled', 'true', function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     await browser.setAttribute('#login input[type=text]', 'disabled', 'true');
 *   }
 * }
 *
 * @method setAttribute
 * @syntax .setAttribute(selector, attribute, value, [callback])
 * @syntax .setAttribute(using, selector, attribute, value, [callback])
 * @syntax browser.element(selector).setAttribute(name, value)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} attribute The attribute name to set.
 * @param {string} value The attribute value name to set.
 * @param {function} callback Callback function which is called with the result value; not required if using `await` operator.
 * @api protocol.elementinteraction
 */
class SetAttribute extends BaseElementCommand {
  get extraArgsCount() {
    return 2;
  }

  get elementProtocolAction() {
    return 'setElementAttribute';
  }
}

module.exports = SetAttribute;
