const ClientCommand = require('../_base-command.js');

/**
 * Set the size of the current window in CSS pixels.
 *
 * @example
 * module.exports = {
 *   'set current window size': function (browser) {
 *      browser.window.setSize(1024, 768, function (result) {
 *        console.log('window resized successfully');
 *      });
 *   },
 *
 *   'set current window size using ES6 async/await': async function (browser) {
 *      await browser.window.setSize(1024, 768);
 *   }
 * }
 *
 * @syntax .window.setSize(width, height, [callback])
 * @method window.setSize
 * @param {number} width The new window width in CSS pixels.
 * @param {number} height The new window height in CSS pixels.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see window.setPosition
 * @see window.setRect
 * @api protocol.window
 */
class SetWindowSize extends ClientCommand {
  static get namespacedAliases() {
    return 'window.resize';
  }

  performAction(callback) {
    const {width, height} = this;

    this.transportActions.setWindowSize(width, height, callback);
  }

  command(width, height, callback) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('First two arguments passed to .window.getPosition() must be of type number.');
    }

    this.width = width;
    this.height = height;

    return super.command(callback);
  }
}

module.exports = SetWindowSize;
