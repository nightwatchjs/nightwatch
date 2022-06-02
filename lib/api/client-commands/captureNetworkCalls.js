const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Capture outgoing network calls from the browser.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .captureNetworkCalls((requestParams) => {
 *        console.log('Request URL: ', requestParams.request.url);
 *        console.log('Request method: ', requestParams.request.method);
 *        console.log('Request headers: ', requestParams.request.headers);
 *      })
 *      .navigateTo('https://www.google.com');
 *  };
 *
 * @method captureNetworkCalls
 * @syntax .captureNetworkCalls(callback)
 * @param {function} callback callback function to be called whenever a outgoing network call is made.
 * @api protocol.userprompts
 */
class CaptureNetworkCalls extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('CaptureNetworkCalls is not supported while using this driver');
      Logger.error(error);

      return callback(error);
    }

    const userCallback = this.userCallback;
    if (userCallback === undefined) {
      const error =  new Error('Callback is missing from .captureNetworkCalls command.');
      Logger.error(error);

      return callback(error);
    }
    
    this.transportActions
      .interceptNetworkCalls(userCallback, callback)
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

module.exports = CaptureNetworkCalls;