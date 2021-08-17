const ProtocolAction = require('./_base-action.js');

/**
 * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
 *
 * @link /#close-window
 * @syntax .closeWindow([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.closeWindow(callback);
  }
};
