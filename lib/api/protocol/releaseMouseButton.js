const ProtocolAction = require('./_base-action.js');
/**
 * Release the depressed left mouse button at the current mouse coordinates (set by `.moveTo()`).
 * 
 *
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class Command extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.release(callback);
  }
};
