const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Query for an element's tag name.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getTagName('#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getTagName('css selector', '#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.getTagName({
 *       selector: '#login',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getTagName('#login');
 *     console.log('tagName', result);
 *   }
 * }
 *
 * @method getTagName
 * @syntax .getTagName(selector, callback)
 * @syntax .getTagName(using, selector, callback)
 * @syntax browser.element(selector).getTagName()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {number} The element's tag name, as a lowercase string.
 * @link /#dfn-get-element-tag-name
 * @api protocol.elementstate
 */
class GetTagName extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementTagName';
  }
}

module.exports = GetTagName;
