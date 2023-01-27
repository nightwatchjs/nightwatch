const ProtocolAction = require('../_base-action.js');

/**
 * Press a particular key on an Android Device.
 *
 * See [official Android Developers docs](https://developer.android.com/reference/android/view/KeyEvent.html) for reference of available Android key code values.
 *
 * @example
 * module.exports = {
 *   'press e with caps lock on (keycode 33 and metastate 1048576)': function (app) {
 *     app
 *       .appium.pressKeyCode(33, 1048576);
 *   },
 *
 *   'press g (keycode 35) with ES6 async/await': async function (app) {
 *     await app.appium.pressKeyCode(35);
 *   }
 * };
 *
 * @syntax .appium.pressKeyCode(keycode, [callback])
 * @syntax .appium.pressKeyCode(keycode, metastate, flags, [callback])
 * @method pressKeyCode
 * @param {number} keycode Key code to press on the device.
 * @param {number} [metastate] Meta state to press the keycode with.
 * @param {number} [flags] Flags for the keypress.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see appium.longPressKeyCode
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(keycode, ...args) {
    let metastate;
    let flags;
    let callback;

    if (typeof keycode !== 'number') {
      throw new Error('The first argument to pressKeyCode is mandatory and must be a number.');
    }

    if (typeof args[0] === 'function') {
      callback = args[0];
    } else {
      [metastate, flags, callback] = args;
    }

    const opts = {
      keycode,
      ...(metastate && {metastate}),
      ...(flags && {flags})
    };

    return this.transportActions.pressDeviceKeyCode(opts, callback);
  }
};
