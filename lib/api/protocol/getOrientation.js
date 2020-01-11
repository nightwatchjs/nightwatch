const ProtocolAction = require('./_base-action.js');

/**
 * Get the current browser orientation.
 *
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The current browser orientation: {LANDSCAPE|PORTRAIT}
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getScreenOrientation(callback);
  }
};
