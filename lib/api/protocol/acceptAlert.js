const ProtocolAction = require('./_base-action.js');

/**
 * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
 *
 * @method acceptAlert
 * @link /#accept-alert
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @exampleLink /api/acceptAlert.js
 * @api protocol.userprompts
 * @deprecated In favour of `.alerts.accept()`.
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.acceptAlert(callback);
  }
};
