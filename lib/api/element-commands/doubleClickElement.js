const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Move to the element and peforms a double-click in the middle of the element.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.doubleClickElement('#main ul li a.first');
 *
 *     browser.doubleClickElement('#main ul li a.first', function(result) {
 *       console.log('double click result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.doubleClickElement('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.doubleClickElement({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.doubleClickElement({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.doubleClickElement('#main ul li a.first');
 *     console.log('double click result', result);
 *   }
 * }
 *
 * @method click
 * @syntax .click(selector, [callback])
 * @syntax .click(using, selector, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 * @link /#dfn-element-click
 */
class doubleClickElement extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'doubleClick';
  }
}

module.exports = doubleClickElement;
