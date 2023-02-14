const ProtocolAction = require('../_base-action.js');

/**
 * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
 *
 * @syntax .alerts.accept([callback])
 * @method alerts.accept
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @exampleLink /api/acceptAlert.js
 * @see alerts.dismiss
 * @see alerts.getText
 * @link /#accept-alert
 * @api protocol.userprompts
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.acceptAlert(callback);
  }
};
