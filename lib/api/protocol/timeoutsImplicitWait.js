const ProtocolAction = require('./_base-action.js');

/**
 * Set the amount of time the driver should wait when searching for elements. If this command is never sent, the driver will default to an implicit wait of 0ms.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.timeoutsImplicitWait(10000, function(result) {
 *      console.log(result);
 *    });
 * }
 *
 * @jsonwire
 * @syntax .timeoutsImplicitWait(ms, [callback])
 * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 */
module.exports = class Action extends ProtocolAction {
  command(ms, callback) {
    if (typeof ms != 'number') {
      throw new Error(`First argument to .timeoutsImplicitWait() command must be a number. ${typeof ms} given: ${ms}`);
    }

    return this.transportActions.setTimeoutsImplicitWait(ms, callback);
  }
};
