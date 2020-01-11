const ProtocolAction = require('./_base-action.js');

/**
 * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
 *
 * @link /#get-alert-text
 * @param {function} callback Callback function which is called with the result value.
 * @returns {string} The text of the currently displayed alert.
 * @api protocol.userprompts
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getAlertText(callback);
  }
};
