const ClientCommand = require('../_base-command.js');

/**
 * Opens a new tab (default) or a separate new window, and changes focus to the newly opened tab/window.
 *
 * This command is only available for W3C Webdriver compatible browsers.
 *
 * @example
 * module.exports = {
 *  'open a new tab/window': function (browser) {
 *     // open a new tab (default)
 *     browser.window.open(function () {
 *       console.log('new tab opened successfully');
 *     });
 *
 *     // open a new window
 *     browser.window.open('window', function () {
 *       console.log('new window opened successfully');
 *     });
 *   },
 *
 *   'open a new tab/window ES6 async demo Test': async function (browser) {
 *     // open a new tab (default)
 *     await browser.window.open();
 *
 *     // open a new window
 *     await browser.window.open('window');
 *   }
 * }
 *
 * @syntax .window.open([callback])
 * @syntax .window.open(type, [callback])
 * @method window.open
 * @param {string} [type] Can be either "tab" or "window", with "tab" set as default if none is specified.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#new-window
 * @see window.close
 * @see window.switchTo
 * @api protocol.window
 */
class OpenNewWindow extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  static get namespacedAliases() {
    return 'window.openNew';
  }

  performAction(callback) {
    const {windowType} = this;

    this.transportActions.openNewWindow(windowType, callback);
  }

  command(type = 'tab', callback) {
    if (typeof type == 'function' && callback === undefined) {
      callback = arguments[0];
      type = 'tab';
    }

    this.windowType = type;

    return super.command(callback);
  }
}

module.exports = OpenNewWindow;
