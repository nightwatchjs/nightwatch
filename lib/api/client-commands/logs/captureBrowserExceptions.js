const ClientCommand = require('../_base-command.js');
const {Logger} = require('../../../utils');

/**
 * Catch the JavaScript exceptions thrown in the browser.
 *
 * @example
 *  describe('catch browser exceptions', function() {
 *    it('captures the js exceptions thrown in the browser', async function() {
 *      await browser.captureBrowserExceptions((event) => {
 *        console.log('>>> Exception:', event);
 *      });
 *
 *      await browser.navigateTo('https://duckduckgo.com/');
 *
 *      const searchBoxElement = await browser.findElement('input[name=q]');
 *      await browser.executeScript(function(_searchBoxElement) {
 *        _searchBoxElement.setAttribute('onclick', 'throw new Error("Hello world!")');
 *      }, [searchBoxElement]);
 *
 *      await browser.elementIdClick(searchBoxElement.getId());
 *    });
 *  });
 *
 * @method captureBrowserExceptions
 * @syntax .captureBrowserExceptions(onExceptionCallback)
 * @param {function} onExceptionCallback Callback function called whenever a new exception is thrown in the browser.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/running-tests/catch-js-exceptions.html
 */
class CatchJsExceptions extends ClientCommand {
  static get namespacedAliases() {
    return 'captureBrowserExceptions';
  }

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

    this.transportActions.catchJsExceptions(userCallback, callback);
  }

  command(userCallback, callback) {
    this.userCallback = userCallback;

    return super.command(callback);
  }
}

module.exports = CatchJsExceptions;
