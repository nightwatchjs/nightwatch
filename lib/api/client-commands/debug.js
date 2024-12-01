const EventEmitter = require('events');
const NightwatchRepl = require('../../testsuite/repl');
const Debuggability = require('../../utils/debuggability.js');
const {By} = require('selenium-webdriver');

/**
 * This command halts the test execution and provides users with a REPL interface where they can type
 * any of the available Nightwatch commands or assertions and it will be executed in the running browser
 * in real-time.
 *
 * This can be used to debug why a certain command in not working as expected or a certain assertion is
 * failing by trying out the commands and assertions in different ways (trying an assertion with different
 * locators until the correct one if found), or just play around with the available Nightwatch commands
 * and assertions.
 *
 * @example
 * // async function is required while using the debug
 * // command to get the correct result as output.
 * this.demoTest = async function (browser) {
 *   browser.debug();
 *
 *   // with no auto-complete
 *   browser.debug({preview: false});
 *
 *   // with a timeout of 6000 ms (time for which the interface
 *   // would wait for a result).
 *   browser.debug({timeout: 6000})
 * };
 *
 * @method debug
 * @param {object} [config] Config options for the REPL interface.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */
class Debug extends EventEmitter {
  static get avoidPrematureParentNodeResolution() {
    return true;
  }

  command(config, callback) {
    // Create context for vm
    const context = {
      browser: this.api,
      app: this.api,
      by: By,
      By: By
    };

    // set the user provided context
    if (config.context) {
      Object.assign(context, config.context);
      delete config.context;
    }

    const repl = new NightwatchRepl(config);

    // eslint-disable-next-line
    console.log(NightwatchRepl.introMessage());

    // TODO: what's the use of this `if` block?
    if (config?.selector) {
      this.api.executeScript('console.log("Element ' + config.selector + ':", document.querySelector("' + config.selector + '"))');
    }

    // Before starting REPL server, Set debugMode to true
    Debuggability.debugMode = true;

    // Set isES6AsyncTestcase to true in debugmode
    const isES6AsyncTestcase = this.client.isES6AsyncTestcase;
    this.client.isES6AsyncTestcase = true;

    repl.startServer(context);

    repl.onExit(() => {
      // On exit, Set debugMode to false
      Debuggability.debugMode = false;
      this.client.isES6AsyncTestcase = isES6AsyncTestcase;

      // if we have a callback, call it right before the complete event
      if (callback) {
        callback.call(this.client.api);
      }

      this.emit('complete');
    });

    return this;
  }
}

module.exports = Debug;
