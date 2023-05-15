const ClientCommand = require('../_base-command.js');

/**
 * Increases the window to the maximum available size without going full-screen.
 *
 * @example
 * module.exports = {
 *  'maximize current window': function (browser) {
 *     browser.window.maximize(function () {
 *       console.log('window maximized successfully');
 *     });
 *   },
 *
 *   'maximize current window using ES6 async/await': async function (browser) {
 *     await browser.window.maximize();
 *   }
 * }
 *
 * @syntax .window.maximize([callback])
 * @method window.maximize
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#maximize-window
 * @see window.minimize
 * @see window.fullscreen
 * @api protocol.window
 */
class MaximizeWindow extends ClientCommand {
  performAction(callback) {
    this.transportActions.maximizeWindow(callback);
  }
}

module.exports = MaximizeWindow;
