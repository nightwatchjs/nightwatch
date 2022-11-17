const ProtocolAction = require('./_base-action.js');

/**
 * Sets the context to be automated, e.g. 'WEBVIEW', or 'NATIVE'. Used when testing hybrid mobile apps using Appium.
 *
 * More info here: https://appium.io/docs/en/commands/context/set-context/
 *
 * @syntax browser.setContext(context, [callback])
 * @method setContext
 * @param {string} context context name to switch to - a string representing an available context.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @moreinfo appium.io/docs/en/writing-running-appium/web/hybrid/index.html
 * @see getContext
 * @see getContexts
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(context, callback) {
    return this.transportActions.setCurrentContext(context, callback);
  }
};
