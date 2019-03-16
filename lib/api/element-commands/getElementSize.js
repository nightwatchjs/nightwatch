const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine an element's size in pixels. Uses `elementIdSize` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getElementSize("#main ul li a.first", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value.width, 500);
 *     this.assert.equal(result.value.height, 20);
 *  });
 * };
 *
 *
 * @method getElementSize
 * @syntax .getElementSize(selector, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdSize
 * @returns {{width: number, height: number}} The width and height of the element in pixels
 * @api protocol.elementstate
 */
class GetElementSize extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementSize';
  }
}

module.exports = GetElementSize;
