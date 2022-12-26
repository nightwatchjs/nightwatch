const ProtocolAction = require('./_base-action.js');

/**
 * Click and hold the left mouse button (at the coordinates set by the last `moveTo` command). Note that the next mouse-related command that should follow is `mouseButtonUp` . Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.
 *
 * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
 *
 * **Since v2.0, this command is deprecated.** It is only available on older JSONWire-based drivers. Please use the new [User Actions API](/api/useractions/).
 *
 * @param {string|number} button The mouse button
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(button, callback) {
    return this.mouseButtonHandler('mouseButtonDown', button, callback);
  }
};
