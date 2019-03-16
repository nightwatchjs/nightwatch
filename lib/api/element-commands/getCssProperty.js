const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Retrieve the value of a css property for a given DOM element. Uses `elementIdCssProperty` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getCssProperty("#main ul li a.first", "display", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, 'inline');
 *   });
 * };
 *
 *
 * @method getCssProperty
 * @syntax .getCssProperty(selector, cssProperty, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {string} cssProperty The CSS property to inspect.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdCssProperty
 * @returns {*} The value of the css property
 * @api protocol.elementstate
 */
class GetCssProperty extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'getElementCSSValue';
  }
}

module.exports = GetCssProperty;
