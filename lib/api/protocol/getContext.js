const ProtocolAction = require('./_base-action.js');

/**
 * Get the current context in which Appium is running. Used when testing hybrid mobile apps using Appium.
 *
 * More info here: https://appium.io/docs/en/commands/context/get-context/
 *
 * @syntax browser.getContext([callback])
 * @method getContext
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string|null} a string representing the current context or `null`, representing "no context"
 * @moreinfo appium.io/docs/en/writing-running-appium/web/hybrid/index.html
 * @see setContext
 * @see getContexts
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentContext(callback);
  }
};
