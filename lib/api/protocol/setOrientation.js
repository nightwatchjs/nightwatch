const ProtocolAction = require('./_base-action.js');

/**
 * Set the current browser/device orientation.
 *
 * @syntax .setOrientation(orientation, [callback])
 * @method setOrientation
 * @param {string} orientation The new browser/device orientation: `LANDSCAPE` or `PORTRAIT`.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see getOrientation
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(orientation, callback) {
    orientation = orientation.toUpperCase();

    if (!ProtocolAction.ScreenOrientation.includes(orientation)) {
      throw new Error('Invalid screen orientation value specified. Accepted values are: ' + ProtocolAction.ScreenOrientation.join(', '));
    }

    return this.transportActions.setScreenOrientation(orientation, callback);
  }
};
