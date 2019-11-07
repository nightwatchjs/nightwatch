const ProtocolAction = require('./_base-action.js');

/**
 * Returns a string serialisation of the DOM of the current page.
 *
 * @link /#getting-page-source
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.document
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getPageSource(callback);
  }
};
