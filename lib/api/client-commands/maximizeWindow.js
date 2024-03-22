const ClientCommand = require('./_base-command.js');

/**
 * Maximizes the current window.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.maximizeWindow();
 *  };
 *
 *
 * @method maximizeWindow
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see windowMaximize
 * @api protocol.contexts
 * @deprecated In favour of `.window.maximize()`.
 */
class WindowMaximize extends ClientCommand {

  performAction(callback) {
    this.api.windowMaximize('current', callback);
  }
}

module.exports = WindowMaximize;
