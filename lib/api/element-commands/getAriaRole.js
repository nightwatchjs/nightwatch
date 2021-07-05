const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the computed WAI-ARIA role of an element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getAriaRole('*[name="search"]', function(result) {
 *       this.assert.equal(typeof result, 'object');
 *       this.assert.equal(result.value, 'combobox');
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getAriaRole('css selector', '*[name="search"]', function(result) {
 *       console.log('getAriaRole result', result.value);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getAriaRole({
 *       selector: '*[name="search"]',
 *       index: 1
 *     }, function(result) {
 *       console.log('getAriaRole result', result.value);
 *     });
 *
 *     browser.getAriaRole({
 *       selector: '*[name="search"]',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     }, function(result) {
 *       console.log('getAriaRole result', result.value);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getAriaRole('*[name="search"]');
 *     console.log('getAriaRole result', result);
 *   }
 * }
 *
 * @method getAriaRole
 * @syntax .getAriaRole(selector, callback)
 * @syntax .getAriaRole(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The computed WAI-ARIA role of element.
 * @link /#dfn-get-computed-role
 * @api protocol.elementstate
 */
class GetAriaRole extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementAriaRole';
  }
}

module.exports = GetAriaRole;
