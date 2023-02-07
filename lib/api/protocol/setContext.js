const ProtocolAction = require('./_base-action.js');

/**
 * Sets the context.
 *
 * @param {string} context context name to switch to - a string representing an available context.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.mobile
 * @deprecated In favour of `.appium.setContext()`
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(context, callback) {
    return this.transportActions.setCurrentContext(context, callback);
  }
};
