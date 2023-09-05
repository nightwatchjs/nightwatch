const ClientCommand = require('../_base-command.js');
const {isFunction} = require('../../../utils/index.js');

/**
 * Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous.
 *
 * The function to be injected receives the `done` callback as argument which needs to be called when the asynchronous operation finishes. The value passed to the `done` callback is returned to the client.
 * Additional arguments for the injected function may be passed as a non-empty array which will be passed before the `done` callback.
 *
 * Asynchronous script commands may not span page loads. If an unload event is fired while waiting for the script result, an error will be returned.
 *
 * @example
 * describe('execute async script', function() {
 *   it('executes async script in browser', function(browser) {
 *     browser.executeAsyncScript(function(done) {
 *       setTimeout(function() {
 *         done(true);
 *       }, 500);
 *     }, function(result) {
 *       // whatever is passed to the `done` callback in the script above
 *       // will be available as result.value
 *       console.log(result.value); // true
 *     });
 *   });
 *
 *   it('executes a script with ES6 async/await', async function(browser) {
 *     const result = await browser
 *       .document.executeAsync(function(arg1, arg2, done) {
 *         setTimeout(function() {
 *           done(arg1);
 *         }, 500);
 *       }, [arg1, arg2]);
 *
 *     // whatever is passed to the `done` callback in the script above
 *     // will be returned by the command when used with `await`.
 *     console.log(result); // arg1
 *   });
 * });
 *
 * @method document.executeAsyncScript
 * @syntax .executeAsync(body, [args], [callback])
 * @syntax .executeAsyncScript(body, [args], [callback])
 * @syntax .document.executeAsync(body, [args], [callback])
 * @syntax .document.executeAsyncScript(body, [args], [callback])
 * @param {string|function} body The function body to be injected.
 * @param {Array} args An array of arguments which will be passed to the function.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {*} The script result.
 * @see document.executeScript
 * @link /#execute-async-script
 * @api protocol.document
 */
class ExecuteAsyncScript extends ClientCommand {
  static get namespacedAliases() {
    return ['document.executeAsync', 'executeAsync', 'executeAsyncScript'];
  }

  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    const {script, scriptArgs} = this;

    this.executeScriptHandler('executeAsyncScript', script, scriptArgs, callback);
  }

  command(script, args, callback) {
    if (!script) {
      throw new Error('First argument passed to .executeAsyncScript() must be defined.');
    }

    if (arguments.length === 1) {
      args = [];
    } else if (arguments.length === 2 && isFunction(arguments[1])) {
      callback = arguments[2];
      args = [];
    }

    this.script = script;
    this.scriptArgs = args;

    return super.command(callback);
  }
};

module.exports = ExecuteAsyncScript;
