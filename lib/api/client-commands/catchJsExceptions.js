const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Catch the JS exceptions in the browser.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    await browser.catchJsExceptions((event) => {
 *      console.log('Exception:', event);
 *    });
 *    await browser.navigateTo('https://the-internet.herokuapp.com');
 *    const linkElement = await browser.element('link text', 'Checkboxes');
 *    await browser.executeScript(function(linkElement) {
 *      linkElement.setAttribute('onclick', 'throw new Error("Hello world!")');
 *    }, [linkElement]);
 *    await browser.click(linkElement);
 *  };
 *
 * @method catchJsExceptions
 * @syntax .catchJsExceptions(callback)
 * @param {function} callback Callback function to be called when a new expection has taken place.
 * @api protocol.userprompts
 */
class CatchJsExceptions extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('CatchJsExceptions is not supported while using this driver');
      Logger.error(error);

      return callback(error);
    }

    const userCallback = this.userCallback;
    if (userCallback === undefined) {
      const error =  new Error('Callback is missing from .catchJsExceptions command.');
      Logger.error(error);

      return callback(error);
    }

    this.transportActions
      .catchJsExceptions(userCallback, callback)
      .catch(err => {
        return err;
      })
      .then(result => callback(result));
  }

  command(userCallback, callback) {
    this.userCallback = userCallback;

    return super.command(callback);
  }
}

module.exports = CatchJsExceptions; 