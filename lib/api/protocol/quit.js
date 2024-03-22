const {Logger} = require('../../utils');
const ProtocolAction = require('./_base-action.js');

/**
 * Ends the session and closes down the test WebDriver server, if one is running. This is similar to calling the .end() command, but the former doesn't quit the WebDriver session.
 *
 * This command will also execute the `onBrowserQuit()` global, if one is defined.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.quit(function(result) {
 *     console.log(result.value);
 *   });
 * }
 *
 * @method quit
 * @syntax .quit([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 * @since 2.0.0
 */
module.exports = class Quit extends ProtocolAction {
  async command(callback = function(r) {return r}) {
    try {
      await this.settings.globals.onBrowserQuit(this.api);
    } catch (err) {
      const error = new Error(`Error during onBrowserQuit() global hook: ${err.message}`);
      Logger.error(error);
    }

    return this.transportActions.sessionAction('DELETE').then(async (result) => {
      try {
        await callback.call(this.api, result);
      } catch (err) {
        const error = new Error(`Error while quiting: ${err.message}`);
        Logger.error(error);
      }

      this.client.sessionId = null;
      await this.transport.sessionFinished('FINISHED');
    });
  }
};
