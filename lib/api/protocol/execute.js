const ProtocolAction = require('./_base-action.js');

/**
 * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous.
 * The script argument defines the script to execute in the form of a function body. The value returned by that function will be returned to the client.
 *
 * The function will be invoked with the provided args array and the values may be accessed via the arguments object in the order specified.
 *
 * Under the hood, if the `body` param is a function it is converted to a string with `function.toString()`. Any references to your current scope are ignored.
 *
 * To ensure cross-browser compatibility, the specified function should not be in ES6 format (i.e. `() => {}`). If the execution of the function fails, the first argument of the callback contains error information.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.execute(function(imageData) {
 *      // resize operation
 *      return true;
 *    }, [imageData], function(result) {
 *      // result.value === true
 *    });
 * }
 *
 * @link /#executing-script
 * @param {string|function} body The function body to be injected.
 * @param {Array} args An array of arguments which will be passed to the function.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.document
 * @returns {*} The script result.
 */
module.exports = class Session extends ProtocolAction {
  command(...args) {
    args.unshift('executeScript');

    return this.executeScriptHandler(...args);
  }
};
