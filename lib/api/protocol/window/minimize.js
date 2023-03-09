const ProtocolAction = require('../_base-action.js');

/**
 * Hides the window in the system tray. If the window happens to be in fullscreen mode, it is restored the normal state then it will be "iconified" - minimize or hide the window from the visible screen.
 *
 * @example
 * module.exports = {
 *  'minimize current window': function (browser) {
 *     browser.window.minimize(function () {
 *       console.log('window minimized successfully');
 *     });
 *   },
 *
 *   'minimize current window using ES6 async/await': async function (browser) {
 *     await browser.window.minimize();
 *   }
 * }
 *
 * @syntax .window.minimize([callback])
 * @method window.minimize
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#minimize-window
 * @see window.maximize
 * @see window.fullscreen
 * @api protocol.window
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.minimizeWindow(callback);
  }
};
