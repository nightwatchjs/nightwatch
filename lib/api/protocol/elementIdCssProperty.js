const ProtocolAction = require('./_base-action.js');

/**
 * Retrieve the computed value of the given CSS property of the given element.
 *
 * The CSS property to query should be specified using the CSS property name, not the JavaScript property name (e.g. background-color instead of backgroundColor).
 *
 * @link /#get-element-css-value
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {string} cssPropertyName
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(webElementId, cssPropertyName, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdCssProperty');

    return this.transportActions.getElementCSSValue(webElementId, cssPropertyName, callback);
  }
};
