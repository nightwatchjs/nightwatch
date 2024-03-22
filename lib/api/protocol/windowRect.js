const ProtocolAction = require('./_base-action.js');

/**
 * Change or get the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect). This is defined as a dictionary of the `screenX`, `screenY`, `outerWidth` and `outerHeight` attributes of the window.
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
 *   'demo test .windowRect()': function(browser) {
 *
 *      // Change the screenX and screenY attributes of the window rect.
 *      browser.windowRect({x: 500, y: 500});
 *
 *      // Change the width and height attributes of the window rect.
 *      browser.windowRect({width: 600, height: 300});
 *
 *      // Retrieve the attributes
 *      browser.windowRect(null, function(result) {
 *        console.log(result.value);
 *      });
 *   },
 *
 *   'windowRect ES6 demo test': async function(browser) {
 *      const resultValue = await browser.windowRect(null);
 *      console.log('result value', resultValue);
 *   }
 * }
 *
 * @w3c
 * @link /#dfn-get-window-rect
 * @syntax .windowRect({width, height, x, y}, [callback]);
 * @param {object} options An object specifying either `width` and `height`, `x` and `y`, or all together to set properties for the [window rect](https://w3c.github.io/webdriver/#dfn-window-rect).
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.window
 * @deprecated In favour of `.window.getRect()` and `.window.setRect()`.
 */
const Utils = require('../../utils');

module.exports = class Session extends ProtocolAction {
  command(options, callback = function(r) {return r}) {
    if (arguments[0] === null) {
      return this.transportActions.getWindowRect(callback);
    }

    const {width, height, x, y} = options;

    if (!Utils.isUndefined(width) && !Utils.isNumber(width)) {
      throw new Error(`Width argument passed to .windowRect() must be a number; received: ${typeof width} (${width}).`);
    }

    if (!Utils.isUndefined(height) && !Utils.isNumber(height)) {
      throw new Error(`Height argument passed to .windowRect() must be a number; received: ${typeof height} (${height}).`);
    }

    if (Utils.isNumber(width) && !Utils.isNumber(height) ||
      !Utils.isNumber(width) && Utils.isNumber(height)
    ) {
      throw new Error('Attributes "width" and "height" must be specified together.');
    }

    if (!Utils.isUndefined(x) && !Utils.isNumber(x)) {
      throw new Error(`X position argument passed to .windowRect() must be a number; received: ${typeof x} (${x}).`);
    }

    if (!Utils.isUndefined(y) && !Utils.isNumber(y)) {
      throw new Error(`Y position argument passed to .windowRect() must be a number; received: ${typeof y} (${y}).`);
    }

    if (Utils.isNumber(x) && !Utils.isNumber(y) ||
      !Utils.isNumber(x) && Utils.isNumber(y)
    ) {
      throw new Error('Attributes "x" and "y" must be specified together.');
    }

    return this.transportActions.setWindowRect(arguments[0], callback);
  }
};
