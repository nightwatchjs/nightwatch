const ProtocolAction = require('./_base-action.js');

/**
 * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser.frameParent(function(result) {
 *      console.log(result);
 *    });
 * }
 *
 * @method frameParent
 * @link /#switch-to-parent-frame
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @since v0.4.8
 * @api protocol.frames
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.switchToParentFrame(callback);
  }
};
