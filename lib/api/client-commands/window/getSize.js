const ClientCommand = require('../_base-command.js');

/**
 * Get the size of the current window in pixels.
 *
 * @example
 * module.exports = {
 *   'get current window size': function (browser) {
 *      browser.window.getSize(function (result) {
 *        console.log('Size of current window:', result.value.width, result.value.height);
 *      });
 *   },
 *
 *   'get current window size using ES6 async/await': async function (browser) {
 *      const {width, height} = await browser.window.getSize();
 *      console.log('Size of current window:', width, height);
 *   }
 * }
 *
 * @syntax .window.getSize([callback])
 * @method window.getSize
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {{width: number, height: number}} Size of the current window.
 * @see window.getPosition
 * @see window.getRect
 * @api protocol.window
 */
class GetWindowSize extends ClientCommand {
  performAction(callback) {
    this.transportActions.getWindowSize(callback);
  }
}

module.exports = GetWindowSize;
