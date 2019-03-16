const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine an element's location on the screen once it has been scrolled into view. Uses `elementIdLocationInView` protocol command.
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
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdLocationInView
 * @returns {{x: number, y: number}} The X and Y coordinates for the element on the page.
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
