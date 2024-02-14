const ProtocolAction = require('../_base-action.js');

/**
 * Reset the app during the test.
 *
 * More info here: https://appium.io/docs/en/2.3/commands/base-driver/#reset
 *
 * @example
 * module.exports = {
 *   'reset the app': function (app) {
 *     app
 *       .appium.resetApp();
 *   },
 * };
 *
 * @syntax .appium.resetApp([callback])
 * @method resetApp
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.resetApp(callback);
  }
};
