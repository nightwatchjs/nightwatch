const ProtocolAction = require('./_base-action.js');
const {isFunction} = require('../../utils');

/**
 *  Move to the element and performs a double-click in the middle of the given element if element is given else double-clicks at the current mouse coordinates (set by `.moveTo()`).
 *
 * @method elementIdDoubleClick
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.useractions
 */
module.exports = class elementIdDoubleClick extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(webElementId, callback) {

    if (isFunction(webElementId)) {
      callback = webElementId;
      webElementId = null;
    }

    return this.transportActions.doubleClick(webElementId, callback);
  }
};
