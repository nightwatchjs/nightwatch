const ClientCommand = require('../_base-command.js');

/**
 * Retrieve the current window handle.
 *
 * WebDriver does not make the distinction between windows and tabs. So, if your site opens a new tab or window, you can work with it using a window handle.
 *
 * @example
 * module.exports = {
 *  'get current window handle': function (browser) {
 *     browser.window.getHandle(function (result) {
 *       console.log('current window handle is:', result.value);
 *     });
 *   },
 *
 *   'get current window handle with ES6 async/await': async function (browser) {
 *     const windowHandle = await browser.window.getHandle();
 *     console.log('current window handle is:', windowHandle);
 *   }
 * }
 *
 * @syntax .window.getHandle([callback])
 * @method window.getHandle
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} A unique identifier representing the window handle for the current window.
 * @link /#get-window-handle
 * @see window.getHandles
 * @see window.switchTo
 * @api protocol.window
 */
class GetWindowHandle extends ClientCommand {
  performAction(callback) {
    this.transportActions.getWindowHandle(callback);
  }
}

module.exports = GetWindowHandle;
