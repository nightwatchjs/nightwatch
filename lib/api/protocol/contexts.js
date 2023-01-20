const ProtocolAction = require('./_base-action.js');

/**
 * Get a list of the available contexts.
 *
 * Used by Appium when testing hybrid mobile web apps. More info here: https://appium.readthedocs.io/en/latest/en/commands/context/get-contexts/
 *
 * @method contexts
 * @param {function} callback Callback function to be called when the command finishes.
 * @returns {Array} an array of strings representing available contexts, e.g 'WEBVIEW', or 'NATIVE'
 * @api protocol.mobile
 * @deprecated In favour of `.appium.getContexts()`
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getAvailableContexts(callback);
  }
};
