const ClientCommand = require('../_base-command.js');
const {isFunction} = require('../../../utils/index.js');

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
 * describe('execute script', function() {
 *   it('executes a script in browser', function(browser) {
 *     browser.executeScript(function(imageData) {
 *       // resize operation
 *       return true;
 *     }, [imageData], function(result) {
 *       // whatever is returned by the script passed above will be available
 *       // as result.value
 *       console.log(result.value); // true
 *     });
 *
 *     // scroll to the bottom of the page.
 *     browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');
 *   });
 *
 *   it('executes a script with ES6 async/await', async function(browser) {
 *     const result = await browser
 *       .document.executeScript(function(imageData) {
 *         // resize operation
 *         return true;
 *       }, [imageData]);
 *
 *     console.log(result); // true
 *   });
 * });
 *
 * @method document.executeScript
 * @syntax .execute(body, [args], [callback])
 * @syntax .executeScript(body, [args], [callback])
 * @syntax .document.execute(body, [args], [callback])
 * @syntax .document.executeScript(body, [args], [callback])
 * @param {string|function} body The function body to be injected.
 * @param {Array} args An array of arguments which will be passed to the function.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @returns {*} The script result.
 * @see document.executeAsyncScript
 * @link /#executing-script
 * @api protocol.document
 */
class ExecuteScript extends ClientCommand {
  static get namespacedAliases() {
    return ['document.execute', 'execute', 'executeScript'];
  }

  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    const {script, scriptArgs} = this;

    this.executeScriptHandler('executeScript', script, scriptArgs, callback);
  }

  command(script, args, callback) {
    if (!script) {
      throw new Error('First argument passed to .executeScript() must be defined.');
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

module.exports = ExecuteScript;
