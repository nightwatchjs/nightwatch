const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the computed WAI-ARIA label of an element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getComputedRole('#main ul li a.first', function(result) {
 *       this.assert.equal(typeof result, 'object);
 *       this.assert.equal(result.value, 'nightwatchjs.org');
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getComputedRole('css selector', '#main ul li a.first', function(result) {
 *       console.log('getComputedRole result', result.value);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getComputedRole({
 *       selector: '#main ul li a',
 *       index: 1
 *     }, function(result) {
 *       console.log('getComputedRole result', result.value);
 *     });
 *
 *     browser.getComputedRole({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     }, function(result) {
 *       console.log('getComputedRole result', result.value);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getComputedRole('#main ul li a.first');
 *     console.log('getComputedRole result', result);
 *   }
 * }
 *
 * @method getComputedRole
 * @syntax .getComputedRole(selector, callback)
 * @syntax .getComputedRole(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The element's visible text.
 * @link /#dfn-get-element-text
 * @api protocol.elementstate
 */
class GetComputedRole extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementComputedRole';
  }
}

module.exports = GetComputedRole;
