const ProtocolAction = require('./_base-action.js');

/**
 * Click at the current mouse coordinates (set by `.moveTo()`).
 *
 * The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button.
 *
 * **Since v2.0, this command is deprecated.** It is only available on older JSONWire-based drivers. Please use the new [User Actions API](/api/useractions/).
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

  static get isTraceable() {
    return true;
  }

  command(button, callback) {
    return this.mouseButtonHandler('mouseButtonClick', button, callback);
  }
};
