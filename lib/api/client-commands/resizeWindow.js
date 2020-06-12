const ClientCommand = require('./_base-command.js');

/**
 * Resizes the current window.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.resizeWindow(1000, 800);
 *  };
 *
 *
 * @method resizeWindow
 * @param {number} width The new window width.
 * @param {number} height The new window height.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see windowSize
 * @api protocol.contexts
 */
class ResizeWindow extends ClientCommand {

  performAction(callback) {
    this.api.windowSize('current', this.width, this.height, callback);
  }

  command(width, height, callback) {
    this.width = width;
    this.height = height;

    return super.command(callback);
  }
}

module.exports = ResizeWindow;
