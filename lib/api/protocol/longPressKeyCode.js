const ProtocolAction = require('./_base-action.js');

/**
 * Press and hold a particular key on an Android Device.
 *
 * This command works with Appium only. See [official Android Developers docs](https://developer.android.com/reference/android/view/KeyEvent.html) for reference of available Android key code values.
 *
 * @syntax .longPressKeyCode(keycode, [callback])
 * @syntax .longPressKeyCode(keycode, metastate, flags, [callback])
 * @method longPressKeyCode
 * @param {number} keycode Key code to press on the device.
 * @param {number} [metastate] Meta state to press the keycode with.
 * @param {number} [flags] Flags for the keypress.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see pressKeyCode
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(keycode, ...args) {
    let metastate;
    let flags;
    let callback;

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
