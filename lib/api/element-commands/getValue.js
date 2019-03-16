const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns a form element current value. Uses `elementIdValue` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getValue("form.login input[type=text]", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, "enter username");
 *   });
 * };
 *
 *
 * @method getValue
 * @syntax .getValue(selector, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdValue
 * @returns {string} The element's value.
 * @api protocol.elementstate
 */
class GetValue extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  protocolAction() {
    return this.executeProtocolAction('getElementAttribute', ['value']);
  }
}

module.exports = GetValue;
