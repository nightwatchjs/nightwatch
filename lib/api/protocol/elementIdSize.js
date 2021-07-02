const ProtocolAction = require('./_base-action.js');

/**
 * Determine an element's size in pixels. The size will be returned as a JSON object with width and height properties.
 *
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  get w3c_deprecated() {
    return true;
  }

  get deprecationNotice() {
    return 'Please use .getElementRect().';
  }

  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdSize');

    return this.transportActions.getElementRect(webElementId, callback);
  }
};
