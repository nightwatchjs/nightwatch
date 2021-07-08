const ProtocolAction = require('./_base-action.js');

/**
 * Double-clicks at the current mouse coordinates (set by `.moveTo()`).
 *
 * @method doubleClick
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class DoubleClick extends ProtocolAction {

  get w3c_deprecated() {
    return true;
  }

  get deprecationNotice() {
    return 'Nightwatch now supports the extended Selenium user actions API which is available via the the .perform() command.';
  }

  command(callback) {
    return this.transportActions.doubleClick(callback);
  }
};
