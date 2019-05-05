const ClientCommand = require('./_baseCommand.js');

/**
 * Returns the title of the current page. Uses title protocol command.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.getTitle(function(title) {
 *      this.assert.equal(typeof title, 'string');
 *      this.assert.equal(title, 'Nightwatch.js');
 *    });
 *  };
 *
 *
 * @method getTitle
 * @syntax .getTitle(callback)
 * @param {function} callback Callback function which is called with the result value.
 * @see title
 * @returns {string} The page title.
 * @api protocol.navigation
 */
class GetTitle extends ClientCommand {
  get returnsFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.api.title(callback);
  }
}

module.exports = GetTitle;
