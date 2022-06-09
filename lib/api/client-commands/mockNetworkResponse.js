const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Mock the response of request made on a particular URL.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .mockNetworkResponse('https://www.google.com/', {
 *        status: 200,
 *        headers: {
 *          'Content-Type': 'UTF-8'
 *        },
 *        body: 'Hello there!'
 *      })
 *      .navigateTo('https://www.google.com/');
 *  };
 *
 * @method mockNetworkResponse
 * @syntax .mockNetworkResponse(urlToIntercept, {status, headers, body}, [callback])
 * @param {string} urlToIntercept URL to intercept and mock the response from
 * @param {object} response Response to return
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.userprompts
 */
class MockNetworkResponse extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('MockNetworkResponse is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {urlToIntercept='', response={}} = this;
    
    this.transportActions
      .mockNetworkResponse(urlToIntercept, response, callback)
      .catch(err => {
        return err;
      })
      .then(result => callback(result));
  }

  command(urlToIntercept, response, callback) {
    this.urlToIntercept = urlToIntercept;
    this.response = response;

    return super.command(callback);
  }
}

module.exports = MockNetworkResponse;
