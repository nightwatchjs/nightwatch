const ClientCommand = require('./_base-command.js');

/**
 * Returns the page source. Uses title protocol command.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.getPageSource({pageRanges: ["1,2"]}, function(pageSource) {
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
 * @api protocol.navigation
 */
class GetPageSource extends ClientCommand {
  get returnsFullResultObject() {
    return true;
  }

  performAction(callback) {
    this.api.getPageSource(this.options, callback);
  }

  command(options, callback) {
    this.options = options;

    return super.command(callback);
  }
}

module.exports = GetPageSource;
