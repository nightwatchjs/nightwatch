const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Query for an element's tag name. Uses `elementIdName` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getTagName("#main ul li .first", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, "a");
 *   });
 * };
 *
 *
 * @method getTagName
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @syntax .getTagName(selector, callback)
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdName
 * @returns {number} The element's tag name, as a lowercase string.
 * @api protocol.elementstate
 */
class GetTagName extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementTagName';
  }
}

module.exports = GetTagName;
