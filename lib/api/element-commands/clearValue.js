const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Clear a textarea or a text input element's value. Uses `elementIdValue` protocol action internally.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.clearValue('input[type=text]');
 * };
 *
 *
 * @method clearValue
 * @syntax .clearValue(selector, [callback])
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see elementIdClear
 * @api protocol.elementinteraction
 */
class ClearValue extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'clearElementValue';
  }
}

module.exports = ClearValue;
