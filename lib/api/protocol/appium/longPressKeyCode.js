const ProtocolAction = require('../_base-action.js');

/**
 * Press and hold a particular key on an Android Device.
 *
 * See [official Android Developers docs](https://developer.android.com/reference/android/view/KeyEvent.html) for reference of available Android key code values.
 *
 * @example
 * module.exports = {
 *   'long press e with caps lock on (keycode 33 and metastate 1048576)': function (app) {
 *     app
 *       .appium.longPressKeyCode(33, 1048576);
 *   },
 *
 *   'long press g (keycode 35) with ES6 async/await': async function (app) {
 *     await app.appium.longPressKeyCode(35);
 *   }
 * };
 *
 * @syntax .appium.longPressKeyCode(keycode, [callback])
 * @syntax .appium.longPressKeyCode(keycode, metastate, flags, [callback])
 * @method longPressKeyCode
 * @param {number} keycode Key code to press on the device.
 * @param {number} [metastate] Meta state to press the keycode with.
 * @param {number} [flags] Flags for the keypress.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see appium.pressKeyCode
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
      throw new Error('The first argument to longPressKeyCode is mandatory and must be a number.');
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

    return this.transportActions.longPressDeviceKeyCode(opts, callback);
  }
};
