const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns the visible text for the element. Uses `elementIdText` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.getText("#main ul li a.first", function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, "nightwatchjs.org");
 *   });
 * };
 *
 *
 * @method getText
 * @syntax .getText(selector, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdText
 * @returns {string} The element's visible text.
 * @api protocol.elementstate
 */
class GetText extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'getElementText';
  }
}

module.exports = GetText;
