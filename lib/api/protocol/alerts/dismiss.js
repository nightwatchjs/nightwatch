const ProtocolAction = require('../_base-action.js');

/**
 * Dismisses the currently displayed alert dialog.
 *
 * For confirm() and prompt() dialogs, this is equivalent to clicking the 'Cancel' button.
 * For alert() dialogs, this is equivalent to clicking the 'OK' button.
 *
 * @example
 * module.exports = {
 *   'dismiss open alert': function (browser) {
 *     browser
 *       .alerts.dismiss(function () {
 *         console.log('alert dismissed successfully');
 *       });
 *   },
 *
 *   'dismiss open alert with ES6 async/await': async function (browser) {
 *     await browser.alerts.dismiss();
 *   }
 * };
 *
 * @syntax .alerts.dismiss([callback])
 * @method alerts.dismiss
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see alerts.accept
 * @see alerts.getText
 * @link /#dismiss-alert
 * @api protocol.userprompts
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(callback) {
    return this.transportActions.dismissAlert(callback);
  }
};
