const ProtocolAction = require('./_base-action.js');

/**
 * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.
 *
 * To find out the window handle use `windowHandles` command
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.windowHandles(function(result) {
 *      var handle = result.value[0];
 *      browser.switchToWindow(handle);
 *    });
 *  };
 *
 *  this.demoTestAsync = async function (browser) {
 *    const result = await browser.windowHandles();
 *    var handle = result.value[0];
 *    browser.switchToWindow(handle);
 *  };
 *
 *
 * @method switchToWindow
 * @param {string} handleOrName The server assigned window handle or the name attribute.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see window
 * @api protocol.contexts
 * @deprecated In favour of `.window.switchTo()`.
 */
module.exports = class Action extends ProtocolAction {
  static get namespacedAliases() {
    return 'switchWindow';
  }

  static get isTraceable() {
    return true;
  }

  command(handleOrName, callback) {
    // TODO: error handling

    return this.transportActions.switchToWindow(handleOrName, callback);
  }
};
