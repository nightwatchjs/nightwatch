const ClientCommand = require('./_base-command.js');

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
 *   'demo test .getWindowRect()': function(browser) {
 *      // Retrieve the attributes
 *      browser.getWindowRect(function(value) {
 *        console.log(value);
 *      });
 *   },
 *
 *   'getWindowRect ES6 demo test': async function(browser) {
 *      const resultValue = await browser.getWindowRect();
 *      console.log('result value', resultValue);
 *   }
 * }
 *
 * @w3c
 * @method getWindowRect
 * @link /#dfn-get-window-rect
 * @param {function} callback Callback function to be called when the command finishes.
 * @see windowRect
 * @api protocol.contexts
 * @deprecated In favour of `.window.getRect()`.
 */
class GetWindowRect extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.api.windowRect(null, callback);
  }
}

module.exports = GetWindowRect;
