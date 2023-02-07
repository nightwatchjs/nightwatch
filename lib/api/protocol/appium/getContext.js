const ProtocolAction = require('../_base-action.js');

/**
 * Get the current context in which Appium is running. Used when testing hybrid mobile apps using Appium.
 *
 * More info here: https://appium.io/docs/en/commands/context/get-context/
 *
 * @example
 * module.exports = {
 *   'get current context': function (app) {
 *     app
 *       .appium.getContext(function (result) {
 *         console.log('the current context is:', result.value);
 *       });
 *   },
 *
 *   'get current context with ES6 async/await': async function (app) {
 *     const context = await app.appium.getContext();
 *     console.log('the current context is:', context);
 *   }
 * };
 *
 * @syntax .appium.getContext([callback])
 * @method getContext
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string|null} A string representing the current context, or `null` representing "no context".
 * @moreinfo appium.io/docs/en/writing-running-appium/web/hybrid/index.html
 * @see appium.setContext
 * @see appium.getContexts
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentContext(callback);
  }
};
