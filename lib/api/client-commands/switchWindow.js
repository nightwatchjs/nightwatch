const ClientCommand = require('./_base-command.js');

/**
 * Change focus to another window. The window to change focus to may be specified by its server assigned window handle, or by the value of its name attribute.
 *
 * To find out the window handle use `windowHandles` command
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.windowHandles(function(result) {
 *      var handle = result.value[0];
 *      browser.switchWindow(handle);
 *    });
 *  };
 *
 *  this.demoTestAsync = async function (browser) {
 *    const result = browser.windowHandles();
 *    var handle = result.value[0];
 *    browser.switchWindow(handle);
 *  };
 *
 *
 * @method switchWindow
 * @param {string} handleOrName The server assigned window handle or the name attribute.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see window
 * @api protocol.contexts
 */
class SwitchWindow extends ClientCommand {
  performAction(callback) {
    this.api.window('POST', this.handleOrName, callback);
  }

  command(handleOrName, callback) {
    this.handleOrName = handleOrName;

    return super.command(callback);
  }
}

module.exports = SwitchWindow;
