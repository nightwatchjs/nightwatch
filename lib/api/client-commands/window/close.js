const ClientCommand = require('../_base-command.js');

/**
 * Close the current window or tab. This can be useful when you're working with multiple windows/tabs open (e.g. an OAuth login).
 *
 * After closing a window or tab, you must switch back to a valid window handle (using `.window.switchTo()` command) in order to continue execution.
 *
 * @example
 * module.exports = {
 *  'close current window/tab': function (browser) {
 *     browser.window.close(function (result) {
 *       console.log('current window/tab closed successfully');
 *     });
 *   },
 *
 *   'close current window/tab with ES6 async/await': async function (browser) {
 *     await browser.window.close();
 *   }
 * }
 *
 * @syntax .window.close([callback])
 * @method window.close
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @exampleLink /api/closeWindow.js
 * @link /#close-window
 * @see window.open
 * @api protocol.window
 */
class CloseWindow extends ClientCommand {
  performAction(callback) {
    this.transportActions.closeWindow(callback);
  }
}

module.exports = CloseWindow;
