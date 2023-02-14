const ProtocolAction = require('../_base-action.js');

/**
 * Get the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
 *
 * @syntax .alerts.getText([callback])
 * @method alerts.getText
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} The text of the currently displayed alert.
 * @see alerts.setText
 * @link /#get-alert-text
 * @api protocol.userprompts
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getAlertText(callback);
  }
};
