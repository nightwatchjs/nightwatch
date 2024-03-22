const ClientCommand = require('../_base-command.js');

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
 * @link https://www.w3.org/TR/webdriver#getting-page-source
 * @api protocol.document
 */
class Source extends ClientCommand {
  static get namespacedAliases() {
    return 'document.pageSource';
  }

  performAction(callback) {
    this.transportActions.getPageSource(callback);
  }
}

module.exports = Source;
