const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Simulates a context-click(right click) event on the given DOM element. The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for element [interactability](https://www.w3.org/TR/webdriver/#element-interactability).
 *
 * @example
 * module.exports = {
 *   demoTest() {
 *     browser.rightClick('#main ul li a.first');
 *
 *     browser.rightClick('#main ul li a.first', function(result) {
 *       console.log('Click result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.rightClick('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.rightClick({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.rightClick({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function() {
 *     const result = await browser.rightClick('#main ul li a.first');
 *     console.log('Right click result', result);
 *   }
 * }
 *
 * @method rightClick
 * @syntax .rightClick(selector, [callback])
 * @syntax .rightClick(using, selector, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 * @since 2.0.0
 * @link /#dfn-element-rightClick
 */
class RightClick extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'contextClick';
  }
}

module.exports = RightClick;
