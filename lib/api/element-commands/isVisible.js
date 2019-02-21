const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Determine if an element is currently displayed. Uses `elementIdDisplayed` protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.isVisible('#main', function(result) {
 *     this.assert.equal(typeof result, "object");
 *     this.assert.equal(result.status, 0);
 *     this.assert.equal(result.value, true);
 *   });
 * };
 *
 *
 * @method isVisible
 * @syntax .isVisible(selector, callback)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} callback Callback function which is called with the result value.
 * @see elementIdDisplayed
 * @api protocol.elementstate
 */
class IsVisible extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'isElementDisplayed';
  }
}

module.exports = IsVisible;
