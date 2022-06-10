const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Capture Console API logs.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .startCapturingLogs((event) => {
 *        console.log(event.type, event.timestamp, event.args[0].value);
 *      })
 *      .navigateTo('https://www.google.com')
 *      .executeScript(function() {
 *        console.error('here');
 *      }, []);
 *  };
 *
 * @method startCapturingLogs
 * @syntax .startCapturingLogs(callback)
 * @param {function} callback Callback function to be called when a new log is captured.
 * @api protocol.userprompts
 */
class StartCapturingLogs extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('StartCapturingLogs is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const userCallback = this.userCallback;
    if (userCallback === undefined) {
      const error =  new Error('Callback is missing from .startCapturingLogs command.');
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
