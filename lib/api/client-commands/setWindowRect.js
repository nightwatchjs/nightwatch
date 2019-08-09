const ClientCommand = require('./_baseCommand.js');

/**
 * Change the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect). This is defined as a dictionary of the `screenX`, `screenY`, `outerWidth` and `outerHeight` attributes of the window.
 *
 * Its JSON representation is the following:
 * - `x` - window's screenX attribute;
 * - `y` - window's screenY attribute;
 * - `width` - outerWidth attribute;
 * - `height` - outerHeight attribute.
 *
 * All attributes are in in CSS pixels. To change the window react, you can either specify `width` and `height`, `x` and `y` or all properties together.
 *
 * @example
 * module.exports = {
 *   'demo test .setWindowRect()': function(browser) {
 *
 *      // Change the screenX and screenY attributes of the window rect.
 *      browser.setWindowRect({x: 500, y: 500});
 *
 *      // Change the width and height attributes of the window rect.
 *      browser.setWindowRect({width: 600, height: 300});
 *
 *      // Retrieve the attributes
 *      browser.setWindowRect(function(result) {
 *        console.log(result.value);
 *      });
 *   },
 *
 *   'setWindowRect ES6 demo test': async function(browser) {
 *      await browser.setWindowRect({
 *        width: 600,
 *        height: 300,
 *        x: 100,
 *        y: 100
 *      });
 *   }
 * }
 *
 * @w3c
 * @link /#dfn-get-window-rect
 * @method setWindowRect
 * @syntax .setWindowRect({width, height, x, y}, [callback]);
 * @param {object} options An object specifying either `width` and `height`, `x` and `y`, or all together to set properties for the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see windowRect
 * @api protocol.contexts
 */
class SetWindowRect extends ClientCommand {
  performAction(callback) {
    this.api.windowRect(this.options, callback);
  }

  command(options, callback) {
    this.options = options;

    return super.command(callback);
  }
}

module.exports = SetWindowRect;
