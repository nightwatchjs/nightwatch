const ProtocolAction = require('./_base-action.js');

/**
 * Gets an array of strings for which log types are available. This methods returns the entire WebDriver response, if you are only interested in the logs array, use `.getLogTypes()` instead.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.sessionLogTypes(function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.sessions
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.getSessionLogTypes(callback);
  }
};
