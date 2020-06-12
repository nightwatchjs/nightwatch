const ClientCommand = require('./_base-command.js');

/**
 * Close the current window. This can be useful when you're working with multiple windows open (e.g. an OAuth login).
 * Uses `window` protocol command.
 *
 * @example
 * this.demoTest = function (client) {
 *   client.closeWindow();
 * };
 *
 *
 * @method closeWindow
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see window
 * @api protocol.contexts
 */
class CloseWindow extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.window('DELETE', callback);
  }
}

module.exports = CloseWindow;
