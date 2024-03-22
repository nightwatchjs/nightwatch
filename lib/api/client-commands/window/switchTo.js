const ClientCommand = require('../_base-command.js');

/**
 * Change focus to another window.
 *
 * The window to change focus to must be specified by its server assigned window handle. To find out the window handle, use `window.getAllHandles()` command.
 *
 * @example
 * module.exports = {
 *  'switch to another window': function (browser) {
 *     browser
 *       .navigateTo('https://nightwatchjs.org/__e2e/window/')
 *       .click('#openWindowBttn')
 *       .waitUntil(function () {
 *         // wait until window handle for the new window is available
 *         return new Promise((resolve) => {
 *           browser.window.getAllHandles(function (result) {
 *             resolve(result.value.length === 2);
 *           });
 *         });
 *       })
 *       .perform(async function () {
 *         const originalWindow = await browser.window.getHandle();
 *         const allWindows = await browser.window.getAllHandles();
 *
 *         // loop through to find the new window handle
 *         for (const windowHandle of allWindows) {
 *           if (windowHandle !== originalWindow) {
 *             await browser.window.switchTo(windowHandle);
 *             break;
 *           }
 *         }
 *
 *         const currentWindow = await browser.window.getHandle();
 *         browser.assert.notEqual(currentWindow, originalWindow);
 *       });
 *   },
 *
 *   'switch to another window with ES6 async/await': async function (browser) {
 *     await browser.navigateTo('https://nightwatchjs.org/__e2e/window/');
 *     await browser.click('#openWindowBttn');
 *
 *     // wait until window handle for the new window is available
 *     await browser.waitUntil(async function () {
 *       const windowHandles = await browser.window.getAllHandles();
 *
 *       return windowHandles.length === 2;
 *     });
 *
 *     const originalWindow = await browser.window.getHandle();
 *     const allWindows = await browser.window.getAllHandles();
 *
 *     // loop through available windows to find the new window handle
 *     for (const windowHandle of allWindows) {
 *       if (windowHandle !== originalWindow) {
 *         await browser.window.switchTo(windowHandle);
 *         break;
 *       }
 *     }
 *
 *     const currentWindow = await browser.window.getHandle();
 *     await browser.assert.notEqual(currentWindow, originalWindow);
 *   }
 * }
 *
 * @syntax .window.switchTo(windowHandle, [callback])
 * @method window.switchTo
 * @param {string} windowHandle The server assigned window handle, should be one of the strings that was returned in a call to `.window.getAllHandles()`.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see window.getHandle
 * @see window.getAllHandles
 * @link /#switch-to-window
 * @api protocol.window
 */
class SwitchToWindow extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  static get namespacedAliases() {
    return 'window.switch';
  }

  performAction(callback) {
    const {windowHandle} = this;

    this.transportActions.switchToWindow(windowHandle, callback);
  }

  command(windowHandle, callback) {
    if (typeof windowHandle !== 'string') {
      throw new Error(`windowHandle argument passed to .window.switchTo() must be a string; received: ${typeof windowHandle} (${windowHandle}).`);
    }

    this.windowHandle = windowHandle;

    return super.command(callback);
  }
}

module.exports = SwitchToWindow;
