const ProtocolAction = require('./_base-action.js');

/**
 * Change focus to another window or close the current window. Shouldn't normally be used directly, instead `.switchWindow()` and `.closeWindow()` should be used.
 *
 * @link /#switch-to-window
 * @syntax .window(httpMethod, handleOrName, [callback])
 * @param {string} method The HTTP method to use. Can be either `POST` (change focus) or `DELETE` (close window).
 * @param {string} handleOrName The window to change focus to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
module.exports = class Action extends ProtocolAction {
  get w3c_deprecated() {
    return true;
  }

  get deprecationNotice() {
    return 'Please use either .switchToWindow() or .closeWindow() commands.';
  }

  static get isTraceable() {
    return true;
  }

  command(method, handleOrName, callback) {
    method = method.toUpperCase();

    switch (method) {
      case 'POST':
        if (arguments.length < 2 || handleOrName === undefined) {
          throw new Error('POST requests to /window must include a name parameter also.');
        }

        return this.transportActions.switchToWindow(handleOrName, callback);

      case 'DELETE':
        return this.transportActions.closeWindow(callback);

      default:
        throw new Error('.window() method expects first argument to be either POST or DELETE.');
    }
  }
};
