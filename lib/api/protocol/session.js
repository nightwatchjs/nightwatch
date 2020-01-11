const ProtocolAction = require('./_base-action.js');

/**
 * Get info about, delete or create a new session. Defaults to the current session.
 *
 * @example
 * this.demoTest = function (browser) {
 *    browser.session(function(result) {
 *      console.log(result.value);
 *    });
 *    //
 *    browser.session('delete', function(result) {
 *      console.log(result.value);
 *    });
 *    //
 *    browser.session('delete', '12345-abc', function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 *
 * @link /#new-session
 * @editline L141
 * @syntax .session([action], [sessionId], [callback])
 * @param {string} [action] The http verb to use, can be "get", "post" or "delete". If only the callback is passed, get is assumed by default.
 * @param {string} [sessionId] The id of the session to get info about or delete.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.sessions
 */
module.exports = class Session extends ProtocolAction {
  static get SessionActions() {
    return {
      GET: 'GET',
      POST: 'POST',
      DELETE: 'DELETE'
    };
  }

  command(action = Session.SessionActions.GET, sessionId, callback) {
    if (arguments.length === 1 && typeof arguments[0] == 'function') {
      callback = arguments[0];
      action = Session.SessionActions.GET;
    } else if (arguments[0] && !(arguments[0].toUpperCase() in Session.SessionActions)) {
      sessionId = arguments[0];
      action = Session.SessionActions.GET;
    }

    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
      sessionId = this.api.sessionId;
    }

    action = action.toUpperCase();

    if (action !== Session.SessionActions.POST && !sessionId) {
      sessionId = this.api.sessionId;
    }

    return this.transportActions.sessionAction(action, sessionId, callback);
  }
};
