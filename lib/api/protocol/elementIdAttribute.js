const ProtocolAction = require('./_base-action.js');

/**
 * Get the value of an element's attribute.
 *
 * @link /#get-element-attribute
 * @param {string} webElementId ID of the element to route the command to.
 * @param {string} attributeName The attribute name
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(webElementId, attributeName, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdAttribute');

    return this.transportActions.getElementAttribute(webElementId, attributeName, callback);
  }
};
