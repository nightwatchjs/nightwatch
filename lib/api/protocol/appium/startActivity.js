const ProtocolAction = require('../_base-action.js');

/**
 * Start an Android activity by providing package name, activity name and other optional parameters.
 *
 * More info here: https://appium.io/docs/en/commands/device/activity/start-activity/
 *
 * @example
 * module.exports = {
 *   'start an android activity': function (app) {
 *     app
 *       .appium.startActivity({
 *         appPackage: 'com.android.chrome',
 *         appActivity: 'com.google.android.apps.chrome.Main'
 *       });
 *   },
 *
 *   'start the main Android activity and wait for onboarding activity to start': function (app) {
 *     app
 *       .appium.startActivity({
 *         appPackage: 'org.wikipedia',
 *         appActivity: 'org.wikipedia.main.MainActivity',
 *         appWaitActivity: 'org.wikipedia.onboarding.InitialOnboardingActivity'
 *       });
 *   }
 * };
 *
 * @syntax .appium.startActivity(opts, [callback])
 * @method startActivity
 * @param {string} opts Options to start the activity with. `appPackage` and `appActivity` are required, [others](https://appium.io/docs/en/commands/device/activity/start-activity/#json-parameters) are optional.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see appium.getCurrentActivity
 * @see appium.getCurrentPackage
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(opts = {}, callback) {
    if (!('appPackage' in opts && 'appActivity' in opts)) {
      throw new Error('Please provide both appPackage and appActivity options while using startActivity.');
    }

    return this.transportActions.startActivity(opts, callback);
  }
};
