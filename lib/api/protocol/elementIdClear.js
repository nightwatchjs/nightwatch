const ProtocolAction = require('./_base-action.js');

/**
 * Scrolls into view a submittable element excluding buttons or editable element, and then attempts to clear its value, reset the checked state, or text content.
 *
 * @link /#dfn-element-clear
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class ElementClear extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdClear');

    return this.transportActions.clearElementValue(webElementId, callback);
  }
};
