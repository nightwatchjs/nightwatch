const ProtocolAction = require('./_base-action.js');

/**
 * Get the current browser/device orientation.
 *
 * @syntax .getOrientation([callback])
 * @method getOrientation
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The current browser/device orientation: `LANDSCAPE` or `PORTRAIT`.
 * @see setOrientation
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getScreenOrientation(callback);
  }
};
