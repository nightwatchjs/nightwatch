const ClientCommand = require('../_base-command.js');

/**
 * Fetches the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect) - size and position of the current window.
 *
 * Its JSON representation is the following:
 * - `x` - window's screenX attribute;
 * - `y` - window's screenY attribute;
 * - `width` - outerWidth attribute;
 * - `height` - outerHeight attribute.
 *
 * All attributes are in CSS pixels.
 *
 * @example
 * module.exports = {
 *   'get current window rect': function (browser) {
 *      browser.window.getRect(function (result) {
 *        console.log('Size of current window:', result.value.width, result.value.height);
 *        console.log('Position of current window:', result.value.x, result.value.y);
 *      });
 *   },
 *
 *   'get current window rect using ES6 async/await': async function (browser) {
 *      const {width, height, x, y} = await browser.window.getRect();
 *      console.log('Size of current window:', width, height);
 *      console.log('Position of current window:', x, y);
 *   }
 * }
 *
 * @syntax .window.getRect([callback])
 * @method window.getRect
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {{width: number, height: number, x: number, y: number}} Size and position of the current window.
 * @link /#get-window-rect
 * @see window.getPosition
 * @see window.getSize
 * @api protocol.window
 */
class GetWindowRect extends ClientCommand {
  performAction(callback) {
    this.transportActions.getWindowRect(callback);
  }
}

module.exports = GetWindowRect;
