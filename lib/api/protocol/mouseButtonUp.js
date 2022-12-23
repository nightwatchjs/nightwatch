const ProtocolAction = require('./_base-action.js');

/**
 * Releases the mouse button previously held (where the mouse is currently at). Must be called once for every `mouseButtonDown` command issued.
 *
 * Can be used for implementing drag-and-drop. The button can be (0, 1, 2) or ('left', 'middle', 'right'). It defaults to left mouse button, and if you don't pass in a button but do pass in a callback, it will handle it correctly.
 *
 * * **Since v2.0, this command is deprecated.** It is only available on older JSONWire-based drivers. Please use the new [User Actions API](/api/useractions/).
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
    return this.mouseButtonHandler('mouseButtonUp', button, callback);
  }
};
