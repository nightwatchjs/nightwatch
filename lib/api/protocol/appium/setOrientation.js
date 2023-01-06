const ProtocolAction = require('../_base-action.js');

/**
 * Set the current device orientation.
 *
 * @example
 * module.exports = {
 *   'set orientation to LANDSCAPE': function (app) {
 *     app
 *       .appium.setOrientation('LANDSCAPE');
 *   },
 *
 *   'set orientation to PORTRAIT with ES6 async/await': async function (app) {
 *     await app.appium.setOrientation('PORTRAIT');
 *   }
 * };
 *
 * @syntax .appium.setOrientation(orientation, [callback])
 * @method setOrientation
 * @param {string} orientation The new device orientation: `LANDSCAPE` or `PORTRAIT`.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see appium.getOrientation
 * @api protocol.appium
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
