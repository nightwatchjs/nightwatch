const ProtocolAction = require('./_base-action.js');

/**
 * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page.
 *
 * The element's coordinates are returned as a JSON object with x and y properties.
 *
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementinternal
 * @returns {object} The X and Y coordinates for the element on the page.
 */
module.exports = class Session extends ProtocolAction {
  get w3c_deprecated() {
    return true;
  }

  get deprecationNotice() {
    return 'Please use .getElementRect().';
  }

  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdLocation');

    return this.transportActions.getElementRect(webElementId, callback);
  }
};
