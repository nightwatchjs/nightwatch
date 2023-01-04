const ProtocolAction = require('../_base-action.js');

/**
 * Get the name of the current Android activity.
 *
 * @syntax .appium.getCurrentActivity([callback])
 * @method getCurrentActivity
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} Name of the current activity.
 * @see appium.getCurrentPackage
 * @see appium.startActivity
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentActivity(callback);
  }
};
