const ProtocolAction = require('./_base-action.js');

/**
 * Scrolls into view the form control element and then sends the provided keys to the element, or returns the current value of the element. In case the element is not keyboard interactable, an <code>element not interactable error</code> is returned.
 *
 * @link /#element-send-keys
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {string|array|none} [value] Value to send to element in case of a POST
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  get w3c_deprecated() {
    return true;
  }

  command(webElementId, value, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdValue');

    if (arguments.length === 1 || typeof arguments[1] == 'function') {
      callback = arguments[1] || function (r) {return r};

      return this.transportActions.getElementAttribute(webElementId, 'value', callback);
    }

    return this.transportActions.setElementValue(webElementId, value, callback);
  }
};
