const ProtocolAction = require('./_base-action.js');

/**
 * Hides the window in the system tray. If the window happens to be in fullscreen mode, it is restored the normal state then it will be "iconified" - minimize or hide the window from the visible screen.
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     browser.minimizeWindow(function(result) {
 *       console.log(result);
 *     });
 *   },
 *
 *   'ES6 async demo Test': async function(browser) {
 *     const result = await browser.minimizeWindow();
 *     console.log('result value is:', result.value);
 *   }
 * }
 *
 * @link /#dfn-minimize-window
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.contexts
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.minimizeWindow(callback);
  }
};
