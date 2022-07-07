const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Listen to the `console.log` events and register callbacks to process the event.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .captureBrowserConsoleLogs((event) => {
 *        console.log(event.type, event.timestamp, event.args[0].value);
 *      })
 *      .navigateTo('https://www.google.com')
 *      .executeScript(function() {
 *        console.error('here');
 *      }, []);
 *  };
 *
 * @method captureBrowserConsoleLogs
 * @syntax .captureBrowserConsoleLogs(callback)
 * @param {function} callback Callback function to be called when a new log is captured.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/running-tests/capture-console-messages.html
 */
class StartCapturingLogs extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error = new Error('The command .captureBrowserConsoleLogs() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const userCallback = this.userCallback;
    if (userCallback === undefined) {
      const error =  new Error('Callback is missing from .captureBrowserConsoleLogs() command.');
      Logger.error(error);

      return callback(error);
    }
    
    this.transportActions
      .startLogsCapture(userCallback, callback)
      .catch(err => {
        Logger.error(err);
        callback(err);
      });
  }

  command(userCallback, callback) {
    this.userCallback = userCallback;

    return super.command(callback);
  }
}

module.exports = StartCapturingLogs;
