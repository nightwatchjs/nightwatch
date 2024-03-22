const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determines if an element is selected.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.isSelected('#main select option.first', function(result) {
 *       this.assert.equal(typeof result, "object");
 *       this.assert.equal(result.status, 0);
 *       this.assert.equal(result.value, true);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.isSelected('css selector', '#main select option.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.isSelected({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.isSelected({
 *       selector: '#main select option.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.isSelected('#main select option.first');
 *     console.log('isVisible result', result);
 *   }
 * }
 *
 * @method isSelected
 * @syntax .isSelected(selector, callback)
 * @syntax .isSelected(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @link /#is-element-selected
 * @api protocol.elementstate
 */
class IsSelected extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'isElementSelected';
  }

}

module.exports = IsSelected;
