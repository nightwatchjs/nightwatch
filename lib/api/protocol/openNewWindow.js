const ProtocolAction = require('./_base-action.js');

/**
 * Opens a new top-level browser window, which can be either a tab (default) or a separate new window.
 *
 * This command is only available for W3C Webdriver compatible browsers.
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     // open a new window tab (default)
 *     browser.openNewWindow(function(result) {
 *       console.log(result);
 *     });
 *
 *     // open a new window
 *     browser.openNewWindow('window', function(result) {
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
 * @link /#dfn-new-window
 * @param {string} [type] Can be either "tab" or "window", with "tab" set to default if none is specified.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.contexts
 */
module.exports = class Session extends ProtocolAction {
  command(type = 'tab', callback) {
    return this.transportActions.openNewWindow(type, callback);
  }
};
