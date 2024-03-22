const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve or delete all cookies visible to the current page or set a cookie. Normally this shouldn't be used directly, instead the cookie convenience methods should be used: <code>getCookie</code>, <code>getCookies</code>, <code>setCookie</code>, <code>deleteCookie</code>, <code>deleteCookies</code>.
 *
 * @link /#cookies
 * @param {string} method Http method
 * @param {function|object} [callbackOrCookie] Optional callback function to be called when the command finishes.
 * @see getCookies
 * @see getCookie
 * @see setCookie
 * @see deleteCookie
 * @see deleteCookies
 * @api protocol.cookies
 * @deprecated
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(method, callbackOrCookie) {
    switch (method) {
      case 'GET':
        return this.transportActions.getCookies(callbackOrCookie);

      case 'POST':
        if (arguments.length < 2) {
          throw new Error('POST requests to /cookie must include a cookie object parameter also.');
        }

        return this.transportActions.addCookie(callbackOrCookie, arguments[2]);

      case 'DELETE':
        if (typeof callbackOrCookie === 'undefined' || typeof callbackOrCookie === 'function') {
          return this.transportActions.deleteAllCookies(callbackOrCookie);
        }

        return this.transportActions.deleteCookie(callbackOrCookie, arguments[2]);

      default:
        throw new Error('This method expects first argument to be either GET, POST or DELETE.');
    }
  }
};
