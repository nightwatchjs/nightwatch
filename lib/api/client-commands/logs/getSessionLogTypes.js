const ClientCommand = require('../_base-command.js');

/**
 * Gets the available log types. More info about log types in WebDriver can be found here: https://github.com/SeleniumHQ/selenium/wiki/Logging
 *
 * @example
 * describe('get available log types', function() {
 *   it('get log types', function(browser) {
 *     browser.logs.getSessionLogTypes(function(result) {
 *       const logTypes = result.value;
 *       console.log('Log types available:', logTypes);
 *     });
 *   });
 *
 *   it('get log types with ES6 async/await', async function(browser) {
 *     const logTypes = await browser.logs.getSessionLogTypes();
 *     console.log('Log types available:', logTypes);
 *   });
 * });
 *
 * @syntax .logs.getSessionLogTypes([callback])
 * @method logs.getSessionLogTypes
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {Array<string>} Available log types.
 * @see logs.getSessionLog
 * @api protocol.sessions
 */
class GetSessionLogTypes extends ClientCommand {
  performAction(callback) {
    this.transportActions.getSessionLogTypes(callback);
  }
}

module.exports = GetSessionLogTypes;
