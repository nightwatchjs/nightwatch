const ClientCommand = require('./_baseCommand.js');

/**
 * Utility command to test if the log type is available.
 *
 * @example
 * this.demoTest = function(browser) {
 *   browser.isLogAvailable('browser', function(isAvailable) {
 *     // do something more in here
 *   });
 * }
 *
 *
 * @method isLogAvailable
 * @syntax .isLogAvailable([typeString], callback)
 * @param {string|function} typeString Type of log to test
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.sessions
 * @see getLogTypes
 */
class IsLogAvailable extends ClientCommand {
  performAction(actionCallback) {
    const {typeString} = this;

    this.api.getLogTypes(function(types) {
      let isAvailable;

      try {
        isAvailable = Array.isArray(types) && types.indexOf(typeString) >= 0;
      } catch (err) {
        isAvailable = false;
      }

      actionCallback.call(this, {
        value: isAvailable
      });
    });
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

module.exports = IsLogAvailable;
