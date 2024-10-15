const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine an element's size in pixels. For W3C Webdriver compatible clients (such as GeckoDriver), this command is equivalent to `getLocation` and both return
 * the dimensions and coordinates of the given element:
 * - x: X axis position of the top-left corner of the element, in CSS pixels
 * - y: Y axis position of the top-left corner of the element, in CSS pixels
 * - height: Height of the element’s bounding rectangle in CSS pixels;
 * - width: Width of the web element’s bounding rectangle in CSS pixels.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getElementRect('#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getElementRect('css selector', '#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.getElementRect({
 *       selector: '#login',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getElementRect('#login');
 *     console.log('classList', result);
 *   }
 * }
 *
 * @method getElementRect
 * @syntax .getElementRect(selector, callback)
 * @syntax .getElementRect(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {{width: number, height: number}} The width and height of the element in pixels
 * @link /#dfn-get-element-rect
 * @api protocol.elementstate
 */
class GetElementRect extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementRect';
  }
}

module.exports = GetElementRect;
