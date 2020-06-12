const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine an element's location on the screen once it has been scrolled into view.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getLocationInView("#main ul li a.first", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value.x, 200);
 *     this.assert.equal(result.value.y, 200);
 *   });
 * };
 *
 *
 * @method getLocationInView
 * @syntax .getLocationInView(selector, callback)
 * @syntax .getLocationInView(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @returns {{x: number, y: number}} The X and Y coordinates for the element on the page.
 * @jsonwire
 * @api protocol.elementlocation
 */
class GetLocationInView extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'isElementLocationInView';
  }
}

module.exports = GetLocationInView;
