const util = require('util');
const EventEmitter = require('events');
const NightwatchRepl = require('../../testsuite/repl');

/**
 * This command halts the test execution and provides users with a REPL interface where they can type
 * any of the available Nightwatch commands and the command will be executed in the running browser
 * in real-time.
 * 
 * This can be used to debug why a certain command in not working as expected, find the correct
 * locators for your assertions or just play around with the available Nightwatch commands.
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
 * @param {object} config Config options for the REPL interface.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.utilities
 */

function Debug() {
  EventEmitter.call(this);
}

util.inherits(Debug, EventEmitter);

Debug.prototype.command = function(config, cb) {
  const repl = new NightwatchRepl(config);

  // eslint-disable-next-line
  console.log(NightwatchRepl.introMessage());

  // Create context for vm
  const context = {
    browser: this.api
  };
  repl.startServer(context);

  repl.onExit(() => {
    // if we have a callback, call it right before the complete event
    if (cb) {
      cb.call(this.client.api);
    }

    this.emit('complete');
  });

  return this;
};

module.exports = Debug;
