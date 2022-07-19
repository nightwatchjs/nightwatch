const ProtocolAction = require('./_base-action.js');

/**
 * Query the server's current status.
 *
 * @link /#status
 * @syntax .status([callback])
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.sessions
 */
module.exports = class Action extends ProtocolAction {
  command(callback) {
    return this.transportActions.getStatus(callback);
  }
};
