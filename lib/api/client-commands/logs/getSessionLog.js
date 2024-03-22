const ClientCommand = require('../_base-command.js');

/**
 * Gets a log from Selenium.
 *
 * @example
 * describe('get log from Selenium', function() {
 *   it('get browser log (default)', function(browser) {
 *     browser.logs.getSessionLog(function(result) {
 *       const logEntriesArray = result.value;
 *       console.log('Log length: ' + logEntriesArray.length);
 *       logEntriesArray.forEach(function(log) {
 *         console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
 *       });
 *     });
 *   });
 *
 *   it('get driver log with ES6 async/await', async function(browser) {
 *     const driverLogAvailable = await browser.logs.isSessionLogAvailable('driver');
 *     if (driverLogAvailable) {
 *       const logEntriesArray = await browser.logs.getSessionLog('driver');
 *       logEntriesArray.forEach(function(log) {
 *         console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
 *       });
 *     }
 *   });
 * });
 *
 * @syntax .logs.getSessionLog([typeString], [callback])
 * @method logs.getSessionLog
 * @param {string} typeString Log type to request. Default: 'browser'. Use `.logs.getLogTypes()` command to get all available log types.
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {Array<object>} An array of log Entry objects with properties as defined [here](https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/logging_exports_Entry.html) (see Instance Properties).
 * @see logs.getSessionLogTypes
 * @api protocol.sessions
 */
class GetSessionLog extends ClientCommand {
  performAction(callback) {
    this.transportActions.getLogContents(this.typeString, callback);
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

module.exports = GetSessionLog;
