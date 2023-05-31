const ProtocolAction = require('./_base-action.js');

/**
 * Determine an element's location on the screen once it has been scrolled into view.
 *
 * @link
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinternal
 * @deprecated This is a JSON Wire Protocol command and is no longer supported.
 */
module.exports = class Session extends ProtocolAction {
  get w3c_deprecated() {
    return true;
  }

  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdLocationInView');

    return this.transportActions.isElementLocationInView(webElementId, callback);
  }
};
