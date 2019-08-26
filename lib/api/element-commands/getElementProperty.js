const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Retrieve the value of a property for a given DOM element. Uses `elementIdProperty` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getElementProperty("#main ul li a.first", "href", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, 'https://nightwatchjs.org/');
 *   });
 * };
 *
 *
 * @method getElementProperty
 * @syntax .getElementProperty(selector, property, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {string} property The property to inspect.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdProperty
 * @returns {*} The value of the property
 * @api protocol.elementstate
 */
class GetElementProperty extends BaseElementCommand {
  get extraArgsCount() {
    return 1;
  }

  get elementProtocolAction() {
    return 'getElementProperty';
  }
}

module.exports = GetElementProperty;
