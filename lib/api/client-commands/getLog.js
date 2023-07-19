const ClientCommand = require('./_base-command.js');

/**
 * Gets a log from Selenium.
 *
 * @example
 * this.demoTest = function(client) {
 *   this.getLog('browser', function(logEntriesArray) {
 *     console.log('Log length: ' + logEntriesArray.length);
 *     logEntriesArray.forEach(function(log) {
 *        console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
 *      });
 *   });
 * };
 *
 *
 * @method getLog
 * @syntax .getLog([typeString], callback)
 * @param {string|function} typeString Log type to request
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.sessions
 * @see getLogTypes
 * @deprecated In favour of `.logs.getSessionLog()`.
 */
class GetLog extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  performAction(actionCallback) {
    this.api.sessionLog(this.typeString, actionCallback);
  }

  command(typeString = 'browser', callback) {
    if (arguments.length === 1 && typeof arguments[0] == 'function') {
      callback = arguments[0];
      typeString = 'browser';
    }

    this.typeString = typeString;

    return super.command(callback);
  }
}

module.exports = GetLog;
