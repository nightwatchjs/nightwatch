const ClientCommand = require('../_base-command.js');

/**
 * Delete the cookie with the given name. This command is a no-op if there is no such cookie visible to the current page.
 *
 * @example
 * module.exports = {
 *   'delete a cookie': function (browser) {
 *     browser
 *       .cookies.delete('test_cookie', function () {
 *         console.log('cookie deleted successfully');
 *       });
 *   },
 *
 *   'delete a cookie with ES6 async/await': async function (browser) {
 *     await browser.cookies.delete('test_cookie');
 *   }
 * };
 *
 * @syntax .cookies.delete(cookieName, [callback])
 * @method cookies.delete
 * @param {string} cookieName The name of the cookie to delete.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see cookies.deleteAll
 * @see cookies.get
 * @see cookies.getAll
 * @see cookies.set
 * @api protocol.cookies
 */
class DeleteCookie extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    const {cookieName} = this;

    this.transportActions.deleteCookie(cookieName, callback);
  }

  command(cookieName, callback) {
    if (typeof cookieName !== 'string') {
      throw new Error('First argument passed to .cookies.delete() must be a string.');
    }

    this.cookieName = cookieName;

    return super.command(callback);
  }
}

module.exports = DeleteCookie;
