const ProtocolAction = require('./_base-action.js');

/**
 * Get current context.
 *
 * @param {function} callback Callback function to be called when the command finishes.
 * @returns {string|null} a string representing the current context or `null`, representing "no context"
 * @api protocol.mobile
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getCurrentContext(callback);
  }
};
