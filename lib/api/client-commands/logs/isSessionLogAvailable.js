const ClientCommand = require('../_base-command.js');

/**
 * Utility command to test if the log type is available.
 *
 * @example
 * describe('test if the log type is available', function() {
 *   it('test browser log type', function(browser) {
 *     browser.logs.isSessionLogAvailable('browser', function(result) {
 *       const isAvailable = result.value;
 *       if (isAvailable) {
 *         // do something more in here
 *       }
 *     });
 *   });
 *
 *   it('test driver log type with ES6 async/await', async function(browser) {
 *     const isAvailable = await browser.logs.isSessionLogAvailable('driver');
 *     if (isAvailable) {
 *       // do something more in here
 *     }
 *   });
 * });
 *
 * @syntax .logs.isSessionLogAvailable([typeString], [callback])
 * @method logs.isSessionLogAvailable
 * @param {string} typeString Type of log to test. Default: 'browser'.
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {boolean} True if log type is available.
 * @see logs.getSessionLogTypes
 * @api protocol.sessions
 */
class IsSessionLogAvailable extends ClientCommand {
  performAction(callback) {
    const {typeString} = this;

    this.transportActions.getSessionLogTypes(function(result) {
      if (result.status === 0) {
        const types = result.value;
        let isAvailable;

        try {
          isAvailable = Array.isArray(types) && types.indexOf(typeString) >= 0;
        } catch (err) {
          isAvailable = false;
        }

        result.value = isAvailable;
      }

      callback.call(this, result);
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

module.exports = IsSessionLogAvailable;
