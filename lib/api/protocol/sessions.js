const ProtocolAction = require('./_base-action.js');

/**
 * Returns a list of the currently active sessions.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.sessions(function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @editline L166
 * @section sessions
 * @syntax .sessions(callback)
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.sessions
 */
module.exports = class Sessions extends ProtocolAction {
  command(callback) {
    return this.transportActions.getSessions(callback);
  }
};
