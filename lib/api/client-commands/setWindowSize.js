const ClientCommand = require('./_base-command.js');

/**
 * Sets the current window size in CSS pixels.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.setWindowSize(400, 600);
 *  };
 *
 *
 * @method setWindowSize
 * @param {number} width The new window width in CSS pixels
 * @param {number} height The new window height in CSS pixels
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see windowSize
 * @api protocol.contexts
 */
class SetWindowSize extends ClientCommand {
  performAction(callback) {
    this.api.windowSize('current', this.width, this.height, callback);
  }

  command(width, height, callback) {
    this.width = width;
    this.height = height;

    return super.command(callback);
  }
}

module.exports = SetWindowSize;
