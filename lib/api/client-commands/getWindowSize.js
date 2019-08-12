const ClientCommand = require('./_baseCommand.js');

/**
 * Retrieves the current window size.
 *
 * For clients which are compatible with the [W3C Webdriver API](https://w3c.github.io/webdriver/), `getWindowSize` is an alias of `getWindowRect`.
 *
 * The `getWindowRect` command returns both dimensions and position of the window, using the `windowRect` protocol command.
 *
 * @example
 * module.exports = {
 *   'demo test .getWindowSize()': function(browser) {
 *      // Retrieve the attributes
 *      browser.getWindowSize(function(value) {
 *        console.log(value);
 *      });
 *   },
 *
 *   'getWindowSize ES6 demo test': async function(browser) {
 *      const value = await browser.getWindowSize();
 *      console.log('value', value);
 *   }
 * }
 *
 *
 * @method getWindowSize
 * @syntax .getWindowSize([callback])
 * @param {function} callback Callback function to be called when the command finishes.
 * @see windowRect
 * @api protocol.contexts
 */
class GetWindowSize extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.api.windowSize('current', callback);
  }
}

module.exports = GetWindowSize;
