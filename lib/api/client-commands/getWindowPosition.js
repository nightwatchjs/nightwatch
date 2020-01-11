const ClientCommand = require('./_base-command.js');

/**
 * Retrieves the current window position.
 *
 * For clients which are compatible with the [W3C Webdriver API](https://w3c.github.io/webdriver/), `getWindowPosition` is an alias of `getWindowRect`.
 *
 * The `getWindowRect` command returns both dimensions and position of the window, using the `windowRect` protocol command.
 *
 * @example
 * module.exports = {
 *   'demo test .getWindowPosition()': function(browser) {
 *      // Retrieve the attributes
 *      browser.getWindowPosition(function(value) {
 *        console.log(value);
 *      });
 *   },
 *
 *   'getWindowPosition ES6 demo test': async function(browser) {
 *      const value = await browser.getWindowPosition();
 *      console.log('value', value);
 *   }
 * }
 *
 * @method getWindowPosition
 * @syntax .getWindowPosition([callback])
 * @param {function} callback Callback function to be called when the command finishes.
 * @see windowRect
 * @api protocol.contexts
 */
class GetWindowPosition extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.api.windowPosition('current', callback);
  }
}

module.exports = GetWindowPosition;
