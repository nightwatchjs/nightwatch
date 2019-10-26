const ProtocolAction = require('./_base-action.js');

/**
 * Refresh the current page.
 *
 * @link /#refresh
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.navigation
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.pageRefresh(callback);
  }
};
