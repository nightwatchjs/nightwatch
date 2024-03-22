const ProtocolAction = require('./_base-action.js');

/**
 * Determine if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
 *
 * @link /#is-element-selected
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdSelected');

    return this.transportActions.isElementSelected(webElementId, callback);
  }
};
