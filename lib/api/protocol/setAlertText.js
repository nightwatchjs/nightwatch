const ProtocolAction = require('./_base-action.js');

/**
 * Sends keystrokes to a JavaScript prompt() dialog.
 *
 * @link /#send-alert-text
 * @param {string} value Keystrokes to send to the prompt() dialog
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.userprompts
 * @deprecated In favour of `.alerts.setText()`.
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(value, callback) {
    return this.transportActions.setAlertText(value, callback);
  }
};
