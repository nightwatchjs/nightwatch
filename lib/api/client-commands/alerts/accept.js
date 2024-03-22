const ClientCommand = require('../_base-command.js');

/**
 * Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.
 *
 * @example
 * module.exports = {
 *   'accept open alert': function (browser) {
 *     browser
 *       .alerts.accept(function () {
 *         console.log('alert accepted successfully');
 *       });
 *   },
 *
 *   'accept open alert with ES6 async/await': async function (browser) {
 *     await browser.alerts.accept();
 *   }
 * };
 *
 * @syntax .alerts.accept([callback])
 * @method alerts.accept
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see alerts.dismiss
 * @see alerts.getText
 * @see alerts.setText
 * @link /#accept-alert
 * @api protocol.userprompts
 */
class AcceptAlert extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    this.transportActions.acceptAlert(callback);
  }
}

module.exports = AcceptAlert;
