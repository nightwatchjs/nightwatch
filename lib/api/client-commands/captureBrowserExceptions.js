const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Catch the JavaScript exceptions thrown in the browser.
 *
 * @example
 *  describe('capture browser exceptions', function() {
 *   it('does', async function (browser) {
 *      await browser.captureBrowserExceptions((event) => {
 *        console.log('>>> Exception:', event);
 *      });
 *
 *      await browser.navigateTo('https://duckduckgo.com/');
 *      const aboutLink = await browser.findElement('#logo_homepage_link');
 *
 *   	 await browser.executeScript(function(aboutLink) {
 *        aboutLink.setAttribute('onclick', 'throw new Error("Hello world!")');
 *      }, [aboutLink]);
 *
 *   	 await browser.click(aboutLink);
 *   });
 * });
 *
 * @method captureBrowserExceptions
 * @syntax .captureBrowserExceptions(callback)
 * @param {function} callback Callback function to be called when a new exception has taken place.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/running-tests/catch-js-exceptions.html
 */
class CatchJsExceptions extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome() && !this.api.isEdge()) {
      const error = new Error('The command .captureBrowserExceptions() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const userCallback = this.userCallback;
    if (userCallback === undefined) {
      const error = new Error('Callback is missing from .captureBrowserExceptions() command.');
      Logger.error(error);

      return callback(error);
    }

    this.transportActions
      .catchJsExceptions(userCallback, callback)
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

module.exports = CatchJsExceptions; 