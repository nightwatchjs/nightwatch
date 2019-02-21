const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
 *
 * The element's coordinates are returned as a JSON object with x and y properties. Uses `elementIdLocation` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getLocation("#main ul li a.first", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value.x, 200);
 *     this.assert.equal(result.value.y, 200);
 *   });
 * };
 *
 *
 * @method getLocation
 * @syntax .getLocation(selector, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdLocation
 * @returns {{x:number, y:number}} The X and Y coordinates for the element on the page.
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
