const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page. The element's coordinates are returned as a JSON object with x and y properties.
 *
 * For W3C Webdriver compatible clients (such as GeckoDriver), this command is equivalent to `getElementSize` and both return
 * the dimensions and coordinates of the given element:
 * - x: X axis position of the top-left corner of the element, in CSS pixels
 * - y: Y axis position of the top-left corner of the element, in CSS pixels
 * - height: Height of the element’s bounding rectangle in CSS pixels;
 * - width: Width of the web element’s bounding rectangle in CSS pixels.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.getLocation('#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.getLocation('css selector', '#login', function(result) {
 *       console.log('result', result);
 *     });
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.getLocation({
 *       selector: '#login',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     }, function(result) {
 *       console.log('result', result);
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.getLocation('#login');
 *     console.log('location', result);
 *   }
 * }
 *
 * @method getLocation
 * @syntax .getLocation(selector, callback)
 * @syntax .getLocation(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {{x:number, y:number}} The X and Y coordinates for the element on the page.
 * @link /#dfn-get-element-rect
 * @api protocol.elementlocation
 */
class GetLocation extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementLocation';
  }
}

module.exports = GetLocation;
