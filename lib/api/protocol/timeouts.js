const Utils = require('../../utils');
const ProtocolAction = require('./_base-action.js');

/**
 * Configure or retrieve the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.
 *
 * If called with only a callback as argument, the command will return the existing configured timeout values.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.timeouts('script', 10000, function(result) {
 *      console.log(result);
 *    });
 *
 *    browser.timeouts(function(result) {
 *      console.log('timeouts', result);
 *    });
 * }
 *
 * @link /#set-timeout
 * @editline L188Í
 * @syntax .timeouts([callback])
 * @syntax .timeouts(type, ms, [callback])
 * @section sessions
 * @param {string} type The type of operation to set the timeout for. Valid values are "script" for script timeouts, "implicit" for modifying the implicit wait timeout and "pageLoad" (or "page load" for legacy JsonWire) for setting a page load timeout.
 * @param {number} ms The amount of time, in milliseconds, that time-limited commands are permitted to run.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 */
module.exports = class Timeouts extends ProtocolAction {
  static get TimeoutTypes() {
    return [
      'script',
      'implicit',
      'pageLoad'
    ];
  }

  command(type, ms, callback) {
    if (Utils.isFunction(type) && arguments.length === 1 || arguments.length === 0) {
      return this.transportActions.getTimeouts(type);
    }

    if (!Timeouts.TimeoutTypes.includes(type)) {
      throw new Error(`Invalid timeouts type value: ${type}. Accepted values are: ${Timeouts.TimeoutTypes.join(', ')}`);
    }

    if (typeof ms != 'number') {
      throw new Error(`Second argument to .timeouts() command must be a number. ${ms} given.`);
    }

    return this.transportActions.setTimeoutType(type, ms, callback);
  }
};
