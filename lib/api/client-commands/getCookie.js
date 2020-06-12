const ClientCommand = require('./_base-command.js');

/**
 * Retrieve a single cookie visible to the current page. The cookie is returned as a cookie JSON object, as defined [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object).
 *
 * Uses `cookie` protocol command.
 *
 * @example
 * this.demoTest = function(browser) {
 *   browser.getCookie(name, function callback(result) {
 *     this.assert.equal(result.value, '123456');
 *     this.assert.equals(result.name, 'test_cookie');
 *   });
 * }
 *
 *
 * @method getCookie
 * @param {string} name The cookie name.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.cookies
 * @syntax .getCookie(name, callback)
 * @see cookie
 * @returns {object|null} The cookie object as a selenium cookie JSON object or null if the cookie wasn't found.
 */
class GetCookie extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  /**
   * Perform the .cookie() protocol action and pass the result to the supplied callback
   *  with the original "this" context
   *
   * @param {function} actionCallback
   */
  performAction(actionCallback) {
    const {cookieName} = this;

    this.api.cookie('GET', function(result) {
      let value = null;

      if (Array.isArray(result.value) && result.value.length > 0) {
        for (let i = 0; i < result.value.length; i++) {
          if (result.value[i].name === cookieName) {
            value = result.value[i];
            break;
          }
        }
      }

      actionCallback.call(this, {
        value
      });
    });
  }

  command(name, callback) {
    this.cookieName = name;

    return super.command(callback);
  }
}

module.exports = GetCookie;
