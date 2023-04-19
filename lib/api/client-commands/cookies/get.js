const ClientCommand = require('../_base-command.js');

/**
 * Retrieve a single cookie visible to the current page.
 *
 * The cookie is returned as a cookie JSON object, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
 *
 * @example
 * module.exports = {
 *   'get a cookie': function (browser) {
 *     browser
 *       .cookies.get('test_cookie', function (result) {
 *         const cookie = result.value;
 *         this.assert.equal(cookie.name, 'test_cookie');
 *         this.assert.equal(cookie.value, '123456');
 *       });
 *   },
 *
 *   'get a cookie with ES6 async/await': async function (browser) {
 *     const cookie = await browser.cookies.get('test_cookie');
 *     browser.assert.equal(cookie.name, 'test_cookie');
 *     browser.assert.equal(cookie.value, '123456');
 *   }
 * };
 *
 * @syntax .cookies.get(name, [callback])
 * @method cookies.get
 * @param {string} name The cookie name.
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {object|null} The cookie object with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion), or `null` if the cookie wasn't found.
 * @see cookies.getAll
 * @see cookies.set
 * @see cookies.delete
 * @see cookies.deleteAll
 * @api protocol.cookies
 */
class GetCookie extends ClientCommand {
  performAction(callback) {
    const {cookieName} = this;

    this.transportActions.getCookie(cookieName, callback);
  }

  command(name, callback) {
    if (typeof name !== 'string') {
      throw new Error('First argument passed to .cookies.get() must be a string.');
    }

    this.cookieName = name;

    return super.command(callback);
  }
}

module.exports = GetCookie;
