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
 *     browser.getElementSize('#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getElementSize('css selector', '#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getElementSize({
 *       selector: '#login',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getElementSize('#login');
 *     console.log('classList', result);
 *   }
 * }
 *
 * @method getElementSize
 * @syntax .getElementSize(selector, callback)
 * @syntax .getElementSize(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {{width: number, height: number}} The width and height of the element in pixels
 * @link /#dfn-get-element-rect
 * @api protocol.elementstate
 */
class GetElementSize extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementRect';
  }
}

module.exports = GetElementSize;
