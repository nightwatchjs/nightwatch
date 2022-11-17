const ProtocolAction = require('../_base-action.js');

/**
 * Set the context to be automated. Used when testing hybrid mobile apps using Appium.
 *
 * More info here: https://appium.io/docs/en/commands/context/set-context/
 *
 * @example
 * module.exports = {
 *   'switch to webview context': async function (app) {
 *     app
 *       .waitUntil(async function() {
 *         // wait for webview context to be available
 *         // initially, this.getContexts() only returns ['NATIVE_APP']
 *         const contexts = await this.appium.getContexts();
 *
 *         return contexts.length > 1;
 *       })
 *       .perform(async function() {
 *         // switch to webview context
 *         const contexts = await this.appium.getContexts();  // contexts: ['NATIVE_APP', 'WEBVIEW_<id>']
 *         await this.appium.setContext(contexts[1]);
 *       });
 *   },
 *
 *   'switch to native context': function (app) {
 *     app.appium.setContext('NATIVE_APP');
 *   }
 * };
 *
 * @syntax .appium.setContext(context, [callback])
 * @method setContext
 * @param {string} context context name to switch to - a string representing an available context.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @moreinfo appium.io/docs/en/writing-running-appium/web/hybrid/index.html
 * @see appium.getContext
 * @see appium.getContexts
 * @api protocol.appium
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(context, callback) {
    return this.transportActions.setCurrentContext(context, callback);
  }
};
