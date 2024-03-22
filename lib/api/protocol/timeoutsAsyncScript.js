const ProtocolAction = require('./_base-action.js');

/**
 * Set the amount of time, in milliseconds, that asynchronous scripts executed by `.executeAsync` are permitted to run before they are aborted and a |Timeout| error is returned to the client.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.timeoutsAsyncScript(10000, function(result) {
 *      console.log(result);
 *    });
 * }
 *
 * @method timeoutsAsyncScript
 * @syntax .timeoutsAsyncScript(ms, [callback])
 * @jsonwire
 * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 */
module.exports = class Action extends ProtocolAction {
  command(ms, callback) {
    if (typeof ms != 'number') {
      throw new Error(`First argument to .timeoutsAsyncScript() command must be a number. ${typeof ms} given: ${ms}`);
    }

    return this.transportActions.setTimeoutsAsyncScript(ms, callback);
  }
};
