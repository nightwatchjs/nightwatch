const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the computed WAI-ARIA label of an element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getAccessibleName('*[name="search"]', function(result) {
 *       this.assert.equal(typeof result, 'object);
 *       this.assert.equal(result.value, 'search input');
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getAccessibleName('css selector', '*[name="search"]', function(result) {
 *       console.log('getAccessibleName result', result.value);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getAccessibleName({
 *       selector: '*[name="search"]',
 *       index: 1
 *     }, function(result) {
 *       console.log('getAccessibleName result', result.value);
 *     });
 *
 *     browser.getAccessibleName({
 *       selector: '*[name="search"]',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     }, function(result) {
 *       console.log('getAccessibleName result', result.value);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getAccessibleName('*[name="search"]');
 *     console.log('getAccessibleName result', result);
 *   }
 * }
 *
 * @method getAccessibleName
 * @syntax .getAccessibleName(selector, callback)
 * @syntax .getAccessibleName(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The computed WAI-ARIA label of element.
 * @link /#dfn-get-computed-label
 * @api protocol.elementstate
 */
class GetAccessibleName extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementAccessibleName';
  }
}

module.exports = GetAccessibleName;
