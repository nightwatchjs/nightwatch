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
 *         this.assert.equal(result.name, 'test_cookie');
 *         this.assert.equal(result.value, '123456');
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
  get returnsFullResultObject() {
    return false;
  }

  get resolvesWithFullResultObject() {
    return false;
  }

  /**
   * Perform the .cookie() protocol action and pass the result to the supplied callback
   * with the original "this" context
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
