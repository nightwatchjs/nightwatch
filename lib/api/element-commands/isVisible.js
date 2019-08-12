const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine if an element is currently displayed. Starting with `v1.2` you can suppress element not found errors, in case the element is not found on the page, by specifying the `suppressNotFoundErrors` flag.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.isVisible('#main', function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, true);
 *   });
 * };
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
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
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
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdDisplayed
 * @api protocol.elementstate
 */
class IsVisible extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'isElementDisplayed';
  }
}

module.exports = IsVisible;
