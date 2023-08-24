const ProtocolAction = require('./_base-action.js');

/**
 * Gets the text of the log type specified. To find out the available log types, use `.getLogTypes()`.
 *
 * Returns a [log entry JSON object](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#log-entry-json-object).
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.sessionLog('client', function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @syntax .sessionLog(typeString, callback)
 * @param {string} typeString Type of log to request. Can be one of: client, driver, browser, server
 * @param {function} callback Callback function which is called with the result value.
 * @returns {Array} Array of the text entries of the log.
 * @api protocol.sessions
 * @deprecated In favour of `.logs.getSessionLog()`.
 */
module.exports = class Action extends ProtocolAction {
  command(typeString, callback) {
    return this.transportActions.getLogContents(typeString, callback);
  }
};
