const ProtocolAction = require('../_base-action.js');

/**
 * Get the current device orientation.
 *
 * @syntax .appium.getOrientation([callback])
 * @method getOrientation
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The current device orientation: `LANDSCAPE` or `PORTRAIT`.
 * @see appium.setOrientation
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getScreenOrientation(callback);
  }
};
