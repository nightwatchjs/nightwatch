const ClientCommand = require('./_base-command.js');

/**
 * Returns the page source.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.pageSource(function(pageSource) {
 *      console.log(pageSource);
 *    });
 *  };
 *
 *
 * @method pageSource
 * @syntax .pageSource(callback)
 * @param {function} callback Callback function which is called with the result value.
 * @see pageSource
 * @returns {string} The page source.
 * @api protocol.pageSource
 * @deprecated In favour of `.document.pageSource()`.
 */

class PageSource extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.source(callback);
  }
}

module.exports = PageSource;
