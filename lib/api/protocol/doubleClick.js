const ProtocolAction = require('./_base-action.js');

/**
 * Double-clicks at the current mouse coordinates (set by `.moveTo()`).
 *
 * @method doubleClick
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.doubleClick(callback);
  }
};
