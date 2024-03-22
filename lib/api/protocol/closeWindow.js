const ProtocolAction = require('./_base-action.js');

/**
 * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
 *
 * @link /#close-window
 * @syntax .closeWindow([callback])
 * @exampleLink /api/closeWindow.js
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 * @deprecated In favour of `.window.close()`.
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.closeWindow(callback);
  }
};
