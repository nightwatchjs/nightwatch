const ClientCommand = require('../_base-command.js');
const {Logger} = require('../../../utils');

/**
 * Listen to the `console` events (ex. `console.log` event) and register callback to process the same.
 *
 * @example
 *  describe('capture console events', function() {
 *    it('captures and logs console.log event', function() {
 *      browser
 *        .captureBrowserConsoleLogs((event) => {
 *          console.log(event.type, event.timestamp, event.args[0].value);
 *        })
 *        .navigateTo('https://www.google.com')
 *        .executeScript(function() {
 *          console.log('here');
 *        }, []);
 *    });
 *  });
 *
 * @method captureBrowserConsoleLogs
 * @syntax .captureBrowserConsoleLogs(onEventCallback)
 * @param {function} onEventCallback Callback function called whenever a new console event is captured.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/running-tests/capture-console-messages.html
 */
class StartCapturingLogs extends ClientCommand {
  static get namespacedAliases() {
    return 'captureBrowserConsoleLogs';
  }

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

    this.transportActions.startLogsCapture(userCallback, callback);
  }

  command(userCallback, callback) {
    this.userCallback = userCallback;

    return super.command(callback);
  }
}

module.exports = StartCapturingLogs;
