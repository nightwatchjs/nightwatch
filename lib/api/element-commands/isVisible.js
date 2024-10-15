const BaseElementCommand = require('./_baseElementCommand.js');
const {isUndefined} = require('../../utils');

/**
 * Determine if an element is currently displayed.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.isVisible('#main ul li a.first', function(result) {
 *       this.assert.equal(typeof result, "object");
 *       this.assert.equal(result.status, 0);
 *       this.assert.equal(result.value, true);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.isVisible('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.isVisible({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.isVisible({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.isVisible('#main ul li a.first');
 *     console.log('isVisible result', result);
 *   }
 * }
 *
 * @method isVisible
 * @syntax .isVisible(selector, callback)
 * @syntax .isVisible(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @link /#element-displayedness
 * @api protocol.elementstate
 */
class IsVisible extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  protocolAction() {
    return this.executeProtocolAction('isElementDisplayed');
  }
}

module.exports = IsVisible;
