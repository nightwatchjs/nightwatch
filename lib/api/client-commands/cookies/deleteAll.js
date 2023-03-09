const ClientCommand = require('../_base-command.js');

/**
 * Delete all cookies visible to the current page.
 *
 * @example
 * module.exports = {
 *   'delete all cookies': function (browser) {
 *     browser
 *       .cookies.deleteAll(function() {
 *         console.log('all cookies deleted successfully');
 *       });
 *   },
 *
 *   'delete all cookies with ES6 async/await': async function (browser) {
 *     await browser.cookies.deleteAll();
 *   }
 * };
 *
 * @syntax .cookies.deleteAll([callback])
 * @method cookies.deleteAll
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see cookies.delete
 * @see cookies.get
 * @see cookies.getAll
 * @see cookies.set
 * @api protocol.cookies
 */
class DeleteCookie extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    this.api.cookie('DELETE', callback);
  }
}

module.exports = DeleteCookie;
