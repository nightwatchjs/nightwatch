const ProtocolAction = require('../_base-action.js');

/**
 * Get the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog.
 *
 * @example
 * module.exports = {
 *   'get open alert text': function (browser) {
 *     browser
 *       .alerts.getText(function (result) {
 *         console.log('text on open alert:', result.value);
 *       });
 *   },
 *
 *   'get open alert text with ES6 async/await': async function (browser) {
 *     const alertText = await browser.alerts.getText();
 *     console.log('text on open alert:', alertText);
 *   }
 * };
 *
 * @syntax .alerts.getText([callback])
 * @method alerts.getText
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} The text of the currently displayed alert.
 * @see alerts.accept
 * @see alerts.dismiss
 * @see alerts.setText
 * @link /#get-alert-text
 * @api protocol.userprompts
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getAlertText(callback);
  }
};
