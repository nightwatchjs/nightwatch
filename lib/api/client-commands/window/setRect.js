const ClientCommand = require('../_base-command.js');
const Utils = require('../../../utils/index.js');

/**
 * Change the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect) - size and position of the current window.
 *
 * Its JSON representation is the following:
 * - `x` - window's screenX attribute;
 * - `y` - window's screenY attribute;
 * - `width` - outerWidth attribute;
 * - `height` - outerHeight attribute.
 *
 * All attributes are in CSS pixels.
 *
 * To change the window rect, you can either specify `width` and `height` together, `x` and `y` together, or all properties together.
 *
 * @example
 * module.exports = {
 *   'set current window rect': function (browser) {
 *      // Change the screenX and screenY attributes of the window rect.
 *      browser.window.setRect({x: 500, y: 500});
 *
 *      // Change the outerWidth and outerHeight attributes of the window rect.
 *      browser.window.setRect({width: 600, height: 300});
 *   },
 *
 *   'set current window rect using ES6 async/await': async function (browser) {
 *      // Change all attributes of the window rect at once.
 *      await browser.window.setRect({
 *        width: 600,
 *        height: 300,
 *        x: 100,
 *        y: 100
 *      });
 *   }
 * }
 *
 * @syntax .window.setRect({width, height, x, y}, [callback])
 * @method window.setRect
 * @param {Object} options An object specifying either `width` and `height`, `x` and `y`, or all together to set properties for the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @link /#set-window-rect
 * @see window.setPosition
 * @see window.setSize
 * @api protocol.window
 */
class SetWindowRect extends ClientCommand {
  performAction(callback) {
    const {windowOptions} = this;

    this.transportActions.setWindowRect(windowOptions, callback);
  }

  command(options, callback) {
    const {width, height, x, y} = options;

    if (!Utils.isUndefined(width) || !Utils.isUndefined(height)) {
      // either of width and height is defined, so both must be defined
      if (Utils.isUndefined(width) || Utils.isUndefined(height)) {
        throw new Error('Attributes "width" and "height" must be specified together when using .window.setRect() command.');
      }

      if (!Utils.isNumber(width)) {
        throw new Error(`Width argument passed to .window.setRect() must be a number; received: ${typeof width} (${width}).`);
      }

      if (!Utils.isNumber(height)) {
        throw new Error(`Height argument passed to .window.setRect() must be a number; received: ${typeof height} (${height}).`);
      }
    }

    if (!Utils.isUndefined(x) || !Utils.isUndefined(y)) {
      // either of x and y is defined, so both must be defined
      if (Utils.isUndefined(x) || Utils.isUndefined(y)) {
        throw new Error('Attributes "x" and "y" must be specified together when using .window.setRect() command.');
      }

      if (!Utils.isNumber(x)) {
        throw new Error(`X position argument passed to .window.setRect() must be a number; received: ${typeof x} (${x}).`);
      }

      if (!Utils.isNumber(y)) {
        throw new Error(`Y position argument passed to .window.setRect() must be a number; received: ${typeof y} (${y}).`);
      }
    }

    this.windowOptions = options;

    return super.command(callback);
  }
}

module.exports = SetWindowRect;
