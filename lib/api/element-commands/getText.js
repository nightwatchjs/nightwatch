const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the visible text for the element. Starting with v1.1 `getText()` will also wait for the element to be present (until the specified timeout).
 *
 * Uses `elementIdText` protocol command.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getText('#main ul li a.first', function(result) {
 *       this.assert.equal(typeof result, 'object);
 *       this.assert.strictEqual(result.status, 0); // only when using Selenium / JSONWire
 *       this.assert.equal(result.value, 'nightwatchjs.org');
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getText('css selector', '#main ul li a.first', function(result) {
 *       console.log('getText result', result.value);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getText({
 *       selector: '#main ul li a',
 *       index: 1
 *     }, function(result) {
 *       console.log('getText result', result.value);
 *     });
 *
 *     browser.getText({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     }, function(result) {
 *       console.log('getText result', result.value);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getText('#main ul li a.first');
 *     console.log('getText result', result);
 *   }
 * }
 *
 * @method getText
 * @syntax .getText(selector, callback)
 * @syntax .getText(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdText
 * @returns {string} The element's visible text.
 * @api protocol.elementstate
 */
class GetText extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementText';
  }
}

module.exports = GetText;
