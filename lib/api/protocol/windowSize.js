const ProtocolAction = require('./_base-action.js');

/**
 * Change or get the size of the specified window. If the second argument is a function it will be used as a callback and the call will perform a get request to retrieve the existing window size.
 *
 * @example
 *  this.demoTest = function (browser) {
 *
 *    // Return the size of the specified window. If the :windowHandle URL parameter is "current", the size of the currently active window will be returned.
 *    browser.windowSize('current', function(result) {
 *      console.log(result.value);
 *    });
 *
 *    // Change the size of the specified window.
 *    // If the :windowHandle URL parameter is "current", the currently active window will be resized.
 *    browser.windowSize('current', 300, 300, function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @see windowRect
 * @jsonwire
 * @param {string} windowHandle
 * @param {number} width
 * @param {number} height
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 */
module.exports = class Session extends ProtocolAction {
  command(windowHandle, width, height, callback) {
    if (typeof windowHandle !== 'string') {
      throw new Error('First argument must be a window handle string.');
    }

    if (arguments.length <= 2) {
      if (typeof arguments[1] != 'function') {
        throw new Error(`Second argument passed to .windowSize() should be a callback when not passing width and height - ${typeof arguments[1]} given.`);
      }

      return this.transportActions.getWindowSize(windowHandle, arguments[1]);
    }

    width = Number(width);
    height = Number(height);

    if (typeof width !== 'number' || isNaN(width)) {
      throw new Error('Width argument passed to .windowSize() must be a number.');
    }

    if (typeof height !== 'number' || isNaN(height)) {
      throw new Error('Height argument passed to .windowSize() must be a number.');
    }

    return this.transportActions.setWindowSize(windowHandle, width, height, callback);
  }
};
