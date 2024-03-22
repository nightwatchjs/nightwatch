const ClientCommand = require('../_base-command.js');

/**
 * Get the coordinates of the top left corner of the current window.
 *
 * @example
 * module.exports = {
 *   'get current window position': function (browser) {
 *      browser.window.getPosition(function (result) {
 *        console.log('Position of current window:', result.value.x, result.value.y);
 *      });
 *   },
 *
 *   'get current window position using ES6 async/await': async function (browser) {
 *      const {x, y} = await browser.window.getPosition();
 *      console.log('Position of current window:', x, y);
 *   }
 * }
 *
 * @syntax .window.getPosition([callback])
 * @method window.getPosition
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {{x: number, y: number}} Coordinates representing the position of the current window.
 * @see window.getSize
 * @see window.getRect
 * @api protocol.window
 */
class GetWindowPosition extends ClientCommand {
  performAction(callback) {
    this.transportActions.getWindowPosition(callback);
  }
}

module.exports = GetWindowPosition;
