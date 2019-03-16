const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Retrieve the value of an attribute for a given DOM element. Uses `elementIdAttribute` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getAttribute("#main ul li a.first", "href", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, "#home");
 *   });
 * };
 *
 *
 * @method getAttribute
 * @syntax .getAttribute(selector, attribute, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {string} attribute The attribute name to inspect.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdAttribute
 * @returns {*} The value of the attribute
 * @api protocol.elementstate
 */
class GetAttribute extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'getElementAttribute';
  }
}

module.exports = GetAttribute;
