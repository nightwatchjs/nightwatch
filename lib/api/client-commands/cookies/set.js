const ClientCommand = require('../_base-command.js');

/**
 * Set a cookie, specified as a cookie JSON object, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
 *
 * @example
 * module.exports = {
 *   'set a cookie': function (browser) {
 *     browser
 *       .cookies.set({
 *         name: "test_cookie",
 *         value: "test_value",
 *         path: "/", // (Optional)
 *         domain: "example.org", // (Optional)
 *         secure: false, // (Optional)
 *         httpOnly: false, // (Optional)
 *         expiry: 1395002765 // (Optional) time in seconds since midnight, January 1, 1970 UTC
 *       });
 *   },
 *
 *   'set a cookie with ES6 async/await': async function (browser) {
 *     await browser.cookies.set({
 *       name: 'test_cookie',
 *       value: 'test_value',
 *       domain: 'example.org', // (Optional)
 *       sameSite: 'Lax' // (Optional)
 *     });
 *   }
 * };
 *
 * @syntax .cookies.set(cookie, [callback])
 * @method cookies.set
 * @param {object} cookie The cookie object.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see cookie.get
 * @see cookie.delete
 * @api protocol.cookies
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
