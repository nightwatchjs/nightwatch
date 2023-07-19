const ClientCommand = require('./_base-command.js');

/**
 * Gets the available log types. More info about log types in WebDriver can be found here: https://github.com/SeleniumHQ/selenium/wiki/Logging
 *
 * @example
 * this.demoTest = function(client) {
 *   this.getLogTypes(function(typesArray) {
 *     console.log(typesArray);
 *   });
 * };
 *
 *
 * @method getLogTypes
 * @syntax .getLogTypes(callback)
 * @param {function} callback Callback function which is called with the result value.
 * @returns {Array} Available log types
 * @api protocol.sessions
 * @see sessionLogTypes
 * @deprecated In favour of `.logs.getSessionLogTypes()`.
 */
class GetLogTypes extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  performAction(actionCallback) {
    this.api.sessionLogTypes(actionCallback);
  }

}

module.exports = GetLogTypes;
