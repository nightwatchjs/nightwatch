const ProtocolAction = require('../_base-action.js');

/**
 * Opens a new tab (default) or a separate new window, and changes focus to the newly opened tab/window.
 *
 * This command is only available for W3C Webdriver compatible browsers.
 *
 * @example
 * module.exports = {
 *  'open a new tab/window': function (browser) {
 *     // open a new tab (default)
 *     browser.window.new(function () {
 *       console.log('new tab opened successfully');
 *     });
 *
 *     // open a new window
 *     browser.window.new('window', function () {
 *       console.log('new window opened successfully');
 *     });
 *   },
 *
 *   'open a new tab/window ES6 async demo Test': async function (browser) {
 *     // open a new tab (default)
 *     await browser.window.new();
 *
 *     // open a new window
 *     await browser.window.new('window');
 *   }
 * }
 *
 * @syntax .window.new([callback])
 * @syntax .window.new(type, [callback])
 * @method window.new
 * @param {string} [type] Can be either "tab" or "window", with "tab" set as default if none is specified.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#new-window
 * @see window.close
 * @see window.switchTo
 * @api protocol.window
 */
module.exports = class Session extends ProtocolAction {
  static get AliasName() {
    return 'openNew';
  }

  static get isTraceable() {
    return true;
  }

  command(type = 'tab', callback) {
    if (typeof type == 'function' && callback === undefined) {
      callback = arguments[0];
      type = 'tab';
    }

    return this.transportActions.openNewWindow(type, callback);
  }
};
