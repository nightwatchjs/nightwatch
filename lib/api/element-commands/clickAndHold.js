const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Move to the element and click (without releasing) in the middle of the given element.
 *
 * @example
 * module.exports = {
 *   demoTest() {
 *     browser.clickAndHold('#main ul li a.first');
 *
 *     browser.clickAndHold('#main ul li a.first', function(result) {
 *       console.log('Click result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.clickAndHold('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.clickAndHold({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.clickAndHold({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function() {
 *     const result = await browser.clickAndHold('#main ul li a.first');
 *     console.log('Right click result', result);
 *   }
 * }
 *
 * @method clickAndHold
 * @syntax .clickAndHold(selector, [callback])
 * @syntax .clickAndHold(using, selector, [callback])
 * @syntax browser.element(selector).clickAndHold()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 * @link /#dfn-element-clickAndHold
 * @since 2.0.0
 */
class ClickAndHold extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'pressAndHold';
  }
}

module.exports = ClickAndHold;
