const ClientCommand = require('../_base-command.js');

/**
 * Retrieve all cookies visible to the current page.
 *
 * The cookies are returned as an array of cookie JSON object, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
 *
 * @example
 * module.exports = {
 *   'get all cookies': function (browser) {
 *     browser
 *       .cookies.getAll(function (result) {
 *         this.assert.equal(result.value.length, 1);
 *         this.assert.equal(result.value[0].name, 'test_cookie');
 *       });
 *   },
 *
 *   'get all cookies with ES6 async/await': async function (browser) {
 *     const cookies = await browser.cookies.getAll();
 *     browser.assert.equal(cookies.length, 1);
 *     browser.assert.equal(cookies[0].name, 'test_cookie');
 *   }
 * };
 *
 * @syntax .cookies.getAll([callback])
 * @method cookies.getAll
 * @param {function} [callback] Callback function which will receive the response as an argument.
 * @returns {Array.<object>} A list of cookie JSON objects, with properties as defined [here](https://www.w3.org/TR/webdriver/#dfn-table-for-cookie-conversion).
 * @see cookies.get
 * @see cookies.set
 * @see cookies.delete
 * @see cookies.deleteAll
 * @api protocol.cookies
 */

class GetCookies extends ClientCommand {
  performAction(callback) {
    this.transportActions.getCookies(callback);
  }
}

module.exports = GetCookies;
