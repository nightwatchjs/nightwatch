const ProtocolAction = require('./_base-action.js');

/**
 * Navigate backwards in the browser history, if possible (the equivalent of hitting the browser back button).
 *
 * @method back
 * @link /#back
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.navigateBack(callback);
  }
};
