const ProtocolAction = require('./_base-action.js');

/**
 * Get a list of the available contexts. Used when testing hybrid mobile apps using Appium.
 *
 * More info here: https://appium.io/docs/en/commands/context/get-contexts/
 *
 * @example
 * module.exports = {
 *   'get available contexts': function (browser) {
 *     browser.getContexts(function (result) {
 *       console.log('the available contexts are:', result.value);
 *     });
 *   },
 *
 *   'get available contexts with ES6 async/await': async function (browser) {
 *     const contexts = await browser.getContexts();
 *     console.log('the available contexts are:', contexts);
 *   }
 * };
 *
 * @syntax browser.getContexts([callback])
 * @method getContexts
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {Array} an array of strings representing available contexts, e.g 'WEBVIEW', or 'NATIVE'
 * @moreinfo appium.io/docs/en/writing-running-appium/web/hybrid/index.html
 * @see getContext
 * @see setContext
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getAvailableContexts(callback);
  }
};
