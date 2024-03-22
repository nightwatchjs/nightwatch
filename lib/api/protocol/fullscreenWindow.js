const ProtocolAction = require('./_base-action.js');

/**
 * Sets the current window state to fullscreen.
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     browser.fullscreenWindow(function(result) {
 *       console.log(result);
 *     });
 *   },
 *
 *   'ES6 async demo Test': async function(browser) {
 *     const result = await browser.fullscreenWindow();
 *     console.log('result value is:', result.value);
 *   }
 * }
 *
 * @link /#dfn-fullscreen-window
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.contexts
 * @deprecated In favour of `.window.fullscreen()`.
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.fullscreenWindow(callback);
  }
};
