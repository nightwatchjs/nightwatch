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
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    const {width, height} = this;

    this.transportActions.setWindowSize(
      'current',
      width,
      height
    ).catch(err => {
      return err;
    }).then(result => callback(result));

  }

  command(width, height, callback) {
    this.width = width;
    this.height = height;

    return super.command(callback);
  }
}

module.exports = ResizeWindow;
