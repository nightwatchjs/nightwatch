const ClientCommand = require('./_baseCommand.js');

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
 */
class WindowMaximize extends ClientCommand {

  performAction(callback) {
    this.api.windowMaximize('current', callback);
  }
}

module.exports = WindowMaximize;
