const ProtocolAction = require('./_base-action.js');

/**
 * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous.
 *
 * The function to be injected receives the `done` callback as argument which needs to be called when the asynchronous operation finishes. The value passed to the `done` callback is returned to the client.
 * Additional arguments for the injected function may be passed as a non-empty array which will be passed before the `done` callback.
 *
 * Asynchronous script commands may not span page loads. If an unload event is fired while waiting for the script result, an error will be returned.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.executeAsync(function(done) {
 *      setTimeout(function() {
 *        done(true);
 *      }, 500);
 *    }, function(result) {
 *      // result.value === true
 *    });
 *
 *    browser.executeAsync(function(arg1, arg2, done) {
 *      setTimeout(function() {
 *        done(true);
 *      }, 500);
 *    }, [arg1, arg2], function(result) {
 *      // result.value === true
 *    });
 * }
 *
 * @link /#execute-async-script
 * @param {string|function} script The function body to be injected.
 * @param {Array} args An array of arguments which will be passed to the function.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.document
 * @returns {*} The script result.
 */
module.exports = class Session extends ProtocolAction {
  command(...args) {
    args.unshift('executeScriptAsync');

    return this.executeScriptHandler(...args);
  }
};
