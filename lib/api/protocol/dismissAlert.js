const ProtocolAction = require('./_base-action.js');

/**
 * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
 *
 * For alert() dialogs, this is equivalent to clicking the 'OK' button.
 *
 * @link /#dismiss-alert
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.userprompts
 * @deprecated In favour of `.alerts.dismiss()`.
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.dismissAlert(callback);
  }
};
