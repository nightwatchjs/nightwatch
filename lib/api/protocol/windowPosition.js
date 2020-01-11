const ProtocolAction = require('./_base-action.js');

/**
 * Change or get the position of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window position.
 *
 * @example
 *  this.demoTest = function (browser) {
 *
 *    // Change the position of the specified window.
 *    // If the :windowHandle URL parameter is "current", the currently active window will be moved.
 *    browser.windowPosition('current', 0, 0, function(result) {
 *      console.log(result);
 *    });
 *
 *    // Get the position of the specified window.
 *    // If the :windowHandle URL parameter is "current", the position of the currently active window will be returned.
 *    browser.windowPosition('current', function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @see windowRect
 * @jsonwire
 * @param {string} windowHandle
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.window
 */
module.exports = class Session extends ProtocolAction {
  command(windowHandle, offsetX, offsetY, callback) {
    if (typeof windowHandle !== 'string') {
      throw new Error('First argument must be a window handle string.');
    }

    if (arguments.length <= 2) {
      if (typeof arguments[1] != 'function') {
        throw new Error(`Second argument passed to .windowPosition() should be a callback when not passing offsetX and offsetY - ${typeof arguments[1]} given.`);
      }

      return this.transportActions.getWindowPosition(windowHandle, arguments[1]);
    }

    offsetX = Number(offsetX);
    offsetY = Number(offsetY);

    if (typeof offsetX !== 'number' || isNaN(offsetX)) {
      throw new Error('offsetX argument passed to .windowPosition() must be a number.');
    }

    if (typeof offsetY !== 'number' || isNaN(offsetY)) {
      throw new Error('offsetY argument passed to .windowPosition() must be a number.');
    }

    return this.transportActions.setWindowPosition(windowHandle, offsetX, offsetY, callback);
  }
};
