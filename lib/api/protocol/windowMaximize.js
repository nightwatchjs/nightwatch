const ProtocolAction = require('./_base-action.js');

/**
 * Increases the window to the maximum available size without going full-screen.
 *
 * @example
 * module.exports = {
 *  'demo Test with W3C Webdriver clients': function(browser) {
 *     // W3C Webdriver API doesn't require the window handle parameter anymore
 *     browser.windowMaximize(function(result) {
 *       console.log(result);
 *     });
 *   },
 *
 *   'ES6 async demo Test': async function(browser) {
 *     const result = await browser.windowMaximize();
 *     console.log('result value is:', result.value);
 *   },
 *
 *   'when using JSONWire (deprecated) clients': function(browser) {
 *      browser.windowMaximize('current', function(result) {
 *        console.log(result);
 *      });
 *   }
 * }
 *
 * @link /#dfn-maximize-window
 * @param {string} [handleOrName] Only required when using non-W3C Webdriver protocols (such as JSONWire). windowHandle URL parameter; if it is "current", the currently active window will be maximized.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 * @deprecated In favour of `.window.maximize()`.
 */
module.exports = class Session extends ProtocolAction {
  command(handleOrName = 'current', callback) {
    return this.transportActions.maximizeWindow(handleOrName, callback);
  }
};
