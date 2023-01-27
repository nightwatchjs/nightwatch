const ClientCommand = require('./_base-command.js');

/**
 * Set a cookie, specified as a cookie JSON object, as defined [here](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#cookie-json-object).
 *
 * Uses `cookie` protocol command.
 *
 * @example
 * this.demoTest = function(browser) {
 *   browser.setCookie({
 *     name     : "test_cookie",
 *     value    : "test_value",
 *     path     : "/", (Optional)
 *     domain   : "example.org", (Optional)
 *     secure   : false, (Optional)
 *     httpOnly : false, // (Optional)
 *     expiry   : 1395002765 // (Optional) time in seconds since midnight, January 1, 1970 UTC
 *   });
 * }
 *
 *
 * @method setCookie
 * @param {object} cookie The cookie object.
 * @syntax .setCookie(cookie, [callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.cookies
 * @see cookie
 */
class SetCookie extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    this.api.cookie('POST', this.cookie, callback);
  }

  command(cookie, callback) {
    this.cookie = cookie;

    return super.command(callback);
  }
}

module.exports = SetCookie;
