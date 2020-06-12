const ClientCommand = require('./_base-command.js');

/**
 * Delete all cookies visible to the current page.
 *
 * @example
 * this.demoTest = function(browser) {
 *   browser.deleteCookies(function() {
 *     // do something more in here
 *   });
 * }
 *
 *
 * @method deleteCookies
 * @syntax .deleteCookies([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.cookies
 * @see cookie
 */
class DeleteCookie extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.cookie('DELETE', callback);
  }
}

module.exports = DeleteCookie;
