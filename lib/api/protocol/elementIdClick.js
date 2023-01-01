const ProtocolAction = require('./_base-action.js');

/**
 * Scrolls into view the element and clicks the in-view center point. If the element is not pointer-interactable, an <code>element not interactable</code> error is returned.
 *
 * @link /#element-click
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class ElementClick extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdClick');

    return this.transportActions.clickElement(webElementId, callback);
  }
};
