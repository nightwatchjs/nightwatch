const ProtocolAction = require('./_base-action.js');

/**
 * Navigate forward in the browser history, if possible (the equivalent of hitting the browser forward button).
 *
 * @link /#back
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.navigateForward(callback);
  }
};
