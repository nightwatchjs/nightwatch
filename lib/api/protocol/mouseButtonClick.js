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
module.exports = class Session extends ProtocolAction {
  command(button, callback) {
    let buttonIndex;

    if (arguments.length === 0) {
      button = 0;
    } else {
      if (typeof(button) === 'function') {
        callback = arguments[0];
        button = 0;
      }

      if (typeof button === 'string') {
        buttonIndex = [
          ProtocolActions.MouseButton.LEFT,
          ProtocolActions.MouseButton.MIDDLE,
          ProtocolActions.MouseButton.RIGHT
        ].indexOf(button.toLowerCase());

        if (buttonIndex !== -1) {
          button = buttonIndex;
        }
      }
    }

    return this.transportActions.mouseButtonClick(button, callback);
  }
};
