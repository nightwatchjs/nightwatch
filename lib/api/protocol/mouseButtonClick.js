const ProtocolAction = require('./_base-action.js');

/**
 * Click at the current mouse coordinates (set by `.moveTo()`).
 *
 * The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button.
 *
 * @param {string|number} button The mouse button
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class Command extends ProtocolAction {

  get w3c_deprecated() {
    return true;
  }

  get deprecationNotice() {
    return 'Nightwatch now supports the extended Selenium user actions API which is available via the the .perform() command.';
  }

  command(button, callback) {
    return this.mouseButtonHandler('mouseButtonClick', button, callback);
  }
};
