const ClientCommand = require('./_baseCommand.js');

/**
 * Retrieve all cookies visible to the current page. The cookies are returned as an array of cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
 *
 * Uses `cookie` protocol command.
 *
 * @example
 * this.demoTest = function(browser) {
 *   browser.getCookies(function callback(result) {
 *     this.assert.equal(result.value.length, 1);
 *     this.assert.equals(result.value[0].name, 'test_cookie');
 *   });
 * }
 *
 *
 * @method getCookies
 * @param {function} callback The callback function which will receive the response as an argument.
 * @syntax .getCookies(callback)
 * @api protocol.cookies
 * @see cookie
 * @returns {Array.<object>} A list of cookies.
 */

class GetCookies extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.cookie('GET', callback);
  }
}

module.exports = GetCookies;
