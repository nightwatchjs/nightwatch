const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Clear a textarea or a text input element's value. Starting with v1.1 `clearValue()` will wait for the element to be present (until the specified timeout).
 *
 * If the element is not found, an error is thrown which will cause the test to fail. Starting with `v1.2` you can suppress element not found errors by specifying the `suppressNotFoundErrors` flag.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.clearValue('#login input[type=text]');
 *
 *     browser.clearValue('#login input[type=text]', function(result) {
 *       console.log('clearValue result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.clearValue('css selector', '#login input[type=text]');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.clearValue({
 *       selector: '#login input[type=text]',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.clearValue({
 *       selector: '#login input[type=text]',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   }
 * }
 *
 * @method clearValue
 * @syntax .clearValue(selector, [callback])
 * @syntax .clearValue(using, selector, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 * @link /#dfn-element-clear
 */
class ClearValue extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'clearElementValue';
  }
}

module.exports = ClearValue;
