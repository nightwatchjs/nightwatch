const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns a form element current value.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getValue('#login input[type=text]', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getValue('css selector', '#login input[type=text]', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.getValue({
 *       selector: '#login input[type=text]',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getValue('#login input[type=text]');
 *     console.log('Value', result);
 *   }
 * }
 *
 * @method getValue
 * @syntax .getValue(selector, callback)
 * @syntax browser.element(selector).getValue()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The element's value.
 * @link /#get-element-property
 * @api protocol.elementstate
 */
class GetValue extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  protocolAction() {
    return this.executeProtocolAction('getElementProperty', ['value']);
  }
}

module.exports = GetValue;
