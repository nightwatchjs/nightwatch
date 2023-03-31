const ProtocolAction = require('../_base-action.js');

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
module.exports = class Session extends ProtocolAction {
  static get AliasName() {
    return 'resize';
  }

  command(width, height, callback) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('First two arguments passed to .window.getPosition() must be of type number.');
    }

    return this.transportActions.setWindowSize(width, height, callback);
  }
};
