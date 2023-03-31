const ProtocolAction = require('../_base-action.js');

/**
 * Set the current window state to fullscreen, similar to pressing F11 in most browsers.
 *
 * @example
 * module.exports = {
 *  'make current window fullscreen': function (browser) {
 *     browser.window.fullscreen(function () {
 *       console.log('window in fullscreen mode');
 *     });
 *   },
 *
 *   'make current window fullscreen with ES6 async/await': async function (browser) {
 *     await browser.window.fullscreen();
 *   }
 * }
 *
 * @syntax .window.fullscreen([callback])
 * @method window.fullscreen
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#fullscreen-window
 * @see window.maximize
 * @see window.minimize
 * @api protocol.window
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.fullscreenWindow(callback);
  }
};
