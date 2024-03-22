const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve the qualified tag name of the given element.
 *
 * @link /#get-element-tag-name
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdName');

    return this.transportActions.getElementTagName(webElementId, callback);
  }
};
