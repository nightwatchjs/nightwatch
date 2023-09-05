const ClientCommand = require('../_base-command.js');

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
class SetAlertText extends ClientCommand {
  static get isTraceable() {
    return true;
  }

  performAction(callback) {
    const {alertText} = this;

    this.transportActions.setAlertText(alertText, callback);
  }

  command(value, callback) {
    if (typeof value !== 'string') {
      throw new Error('First argument passed to .alerts.setText() must be a string.');
    }

    this.alertText = value;

    return super.command(callback);
  }
}

module.exports = SetAlertText;
