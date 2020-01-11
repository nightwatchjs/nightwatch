const ClientCommand = require('./_base-command.js');

/**
 * Delete the cookie with the given name. This command is a no-op if there is no such cookie visible to the current page.
 *
 * @example
 * this.demoTest = function(browser) {
 *   browser.deleteCookie("test_cookie", function() {
 *     // do something more in here
 *   });
 * }
 *
 *
 * @method deleteCookie
 * @syntax .deleteCookie(cookieName, [callback])
 * @param {string} cookieName The name of the cookie to delete.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.cookies
 * @see cookie
 */
class DeleteCookie extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.cookie('DELETE', this.cookieName, callback);
  }

  command(cookieName, callback) {
    this.cookieName = cookieName;

    return super.command(callback);
  }
}

module.exports = DeleteCookie;
