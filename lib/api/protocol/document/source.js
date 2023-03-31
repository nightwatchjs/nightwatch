const ProtocolAction = require('../_base-action.js');

/**
 * Get the string serialized source of the current page.
 *
 * @example
 * module.exports = {
 *   'get page source': function (browser) {
 *      browser.document.source(function (result) {
 *        console.log('current page source:', result.value);
 *      });
 *   },
 *
 *   'get page source using ES6 async/await': async function (browser) {
 *      const pageSource = await browser.document.source();
 *      console.log('current page source:', pageSource);
 *   }
 * };
 *
 * @syntax .document.source([callback])
 * @method document.source
 * @param {function} [callback] Callback function which is called with the result value.
 * @returns {string} String serialized source of the current page.
 * @link /#get-page-source
 * @api protocol.document
 */
module.exports = class Source extends ProtocolAction {
  static get AliasName() {
    return 'pageSource';
  }

  command(callback) {
    return this.transportActions.getPageSource(callback);
  }
};
