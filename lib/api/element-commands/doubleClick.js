const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Move to the element and peforms a double-click in the middle of the element.
 *
 * @example
 * module.exports = {
 *   demoTest() {
 *     browser.doubleClick('#main ul li a.first');
 *
 *     browser.doubleClick('#main ul li a.first', function(result) {
 *       console.log('double click result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.doubleClick('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.doubleClick({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.doubleClick({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function() {
 *     const result = await browser.doubleClick('#main ul li a.first');
 *     console.log('double click result', result);
 *   }
 * }
 *
 * @method doubleClick
 * @syntax .doubleClick(selector, [callback])
 * @syntax .doubleClick(using, selector, [callback])
 * @syntax browser.element(selector).doubleClick()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 * @see https://www.selenium.dev/documentation/webdriver/actions_api/mouse/#double-click
 */
class doubleClick extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'doubleClick';
  }
}

module.exports = doubleClick;
