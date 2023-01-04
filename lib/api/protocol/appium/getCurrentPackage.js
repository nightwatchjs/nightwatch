const ProtocolAction = require('../_base-action.js');

/**
 * Get the name of the current Android package.
 *
 * @syntax .appium.getCurrentPackage([callback])
 * @method getCurrentPackage
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} Name of the current package.
 * @see appium.getCurrentActivity
 * @see appium.startActivity
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentPackage(callback);
  }
};
