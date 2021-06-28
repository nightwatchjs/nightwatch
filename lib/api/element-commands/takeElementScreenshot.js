const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the computed WAI-ARIA label of an element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.takeElementScreenshot('#main ul li a.first', function(result) {
 *       this.assert.equal(typeof result, 'object);
 *       this.assert.equal(result.value, 'nightwatchjs.org');
 *     });
 *
 *     // with explicit locate strategy
 *     browser.takeElementScreenshot('css selector', '#main ul li a.first', function(result) {
 *       console.log('takeElementScreenshot result', result.value);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.takeElementScreenshot({
 *       selector: '#main ul li a',
 *       index: 1
 *     }, function(result) {
 *       console.log('takeElementScreenshot result', result.value);
 *     });
 *
 *     browser.takeElementScreenshot({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     }, function(result) {
 *       console.log('takeElementScreenshot result', result.value);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.takeElementScreenshot('#main ul li a.first');
 *     console.log('takeElementScreenshot result', result);
 *   }
 * }
 *
 * @method takeElementScreenshot
 * @syntax .takeElementScreenshot(selector, callback)
 * @syntax .takeElementScreenshot(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The element's visible text.
 * @link /#dfn-get-element-text
 * @api protocol.elementstate
 */
class TakeElementScreenshot extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'takeElementScreenshot';
  }
}

module.exports = TakeElementScreenshot;
