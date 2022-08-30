const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Intercept the request made on a particular URL and mock the response.
 *
 * @example
 *  describe('mock network response', function() {
 *    it('intercepts the request made to Google search and mocks its response', function() {
 *      browser
 *        .mockNetworkResponse('https://www.google.com/', {
 *          status: 200,
 *          headers: {
 *            'Content-Type': 'UTF-8'
 *          },
 *          body: 'Hello there!'
 *        })
 *        .navigateTo('https://www.google.com/')
 *        .pause(2000);
 *    });
 *  });
 *
 * @method mockNetworkResponse
 * @syntax .mockNetworkResponse(urlToIntercept, {status, headers, body}, [callback])
 * @param {string} urlToIntercept URL to intercept and mock the response from.
 * @param {object} response Response to return. Defaults: `{status: 200, headers: {}, body: ''}`.
 * @param {function} [callback] Callback function to be called when the command finishes.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/network-requests/mock-network-response.html
 */
class MockNetworkResponse extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('The command .mockNetworkResponse() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {response = {}} = this;
    let {urlToIntercept = ''} = this;

    if (urlToIntercept.startsWith('/')) {
      const launchUrl = this.api.launchUrl || this.api.globals.launchUrl || '';
      const needsSlash = launchUrl.endsWith('/');
      const slashDel = needsSlash ? '/' : '';
      urlToIntercept = `${launchUrl}${slashDel}${urlToIntercept}`;
    }
    
    this.transportActions
      .mockNetworkResponse(urlToIntercept, response, callback)
      .catch(err => {
        Logger.error(err);
        callback(err);
      });
  }

  command(urlToIntercept, response, callback) {
    this.urlToIntercept = urlToIntercept;
    this.response = response;

    return super.command(callback);
  }
}

module.exports = MockNetworkResponse;
