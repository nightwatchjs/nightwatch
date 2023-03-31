const ProtocolAction = require('../_base-action.js');

/**
 * Send keystrokes to a JavaScript prompt() dialog.
 *
 * @example
 * module.exports = {
 *   'set text on JS prompt': function (browser) {
 *     browser
 *       .alerts.setText('some text', function () {
 *         console.log('text sent to JS prompt successfully');
 *       });
 *   },
 *
 *   'set text on JS prompt with ES6 async/await': async function (browser) {
 *     await browser.alerts.setText('some text');
 *   }
 * };
 *
 * @syntax .alerts.setText(value, [callback])
 * @method alerts.setText
 * @param {string} value Keystrokes to send to the prompt() dialog
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see alerts.accept
 * @see alerts.dismiss
 * @see alerts.getText
 * @link /#send-alert-text
 * @api protocol.userprompts
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(value, callback) {
    return this.transportActions.setAlertText(value, callback);
  }
};
