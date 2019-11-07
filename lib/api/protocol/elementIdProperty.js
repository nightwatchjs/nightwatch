const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve the value of a specified DOM property for the given element. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 *
 * @link /#get-element-property
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {string} DOMPropertyName
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class ElementIdProperty extends ProtocolAction {
  command(webElementId, DOMPropertyName, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdProperty');

    return this.transportActions.getElementProperty(webElementId, DOMPropertyName, callback);
  }
};
