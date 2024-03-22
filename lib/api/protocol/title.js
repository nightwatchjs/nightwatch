const ProtocolAction = require('./_base-action.js');

/**
 * Get the current page title.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.title(function(result) {
 *      console.log(result.value);
 *    });
 * }
 *
 * @link /#get-title
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.getPageTitle(callback);
  }
};
