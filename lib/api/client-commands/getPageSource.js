const ClientCommand = require('./_base-command.js');

/**
 * Returns the page source. Uses pageSource protocol command.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.getPageSource(function(pageSource) {
 *      console.log(pageSource);
 *    });
 *  };
 *
 *
 * @method getPageSource
 * @syntax .getPageSource(callback)
 * @param {function} callback Callback function which is called with the result value.
 * @see pageSource
 * @returns {string} The page source.
 * @api protocol.pageSource
 */
class GetPageSource extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.pageSource(callback);
  }
}

module.exports = GetPageSource;
