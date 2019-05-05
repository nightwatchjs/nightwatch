const ClientCommand = require('./_baseCommand.js');

/**
 * Sets the current window position.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.setWindowPosition(0, 0);
 *  };
 *
 *
 * @method setWindowPosition
 * @param {number} offsetX The new window offset x-position.
 * @param {number} offsetY The new window offset y-position.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see windowPosition
 * @api protocol.contexts
 */
class SetWindowPosition extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.windowPosition('current', this.offsetX, this.offsetY, callback);
  }

  command(offsetX, offsetY, callback) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    return super.command(callback);
  }
}

module.exports = SetWindowPosition;
