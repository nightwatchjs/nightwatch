const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Clear a textarea or a text input element's value.
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
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
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
 * @syntax browser.clearValue('&lt;SELECTOR&gt;', function (result) { }])
 * @syntax
 * // using global element()
 * browser.clearValue(element('&lt;SELECTOR&gt;'))
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
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

  static get isTraceable() {
    return true;
  }
}

module.exports = ClearValue;
