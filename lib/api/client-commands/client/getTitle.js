const ClientCommand = require('../_base-command.js');
const {Logger} = require('../../../utils');

/**
 * Returns the title of the current page.
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
  static get namespacedAliases() {
    return 'getTitle';
  }

  get returnsFullResultObject() {
    return false;
  }

  performAction(callback) {
    this.transportActions
      .getPageTitle(callback)
      .catch(err => {
        Logger.error(err);
        callback(err);
      });
  }
}

module.exports = GetTitle;
