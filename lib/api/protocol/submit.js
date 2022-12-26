const ProtocolAction = require('./_base-action.js');

/**
 * Submit a FORM element. The submit command may also be applied to any element that is a descendant of a FORM element.
 *
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinternal
 */
module.exports = class Session extends ProtocolAction {
  static get isTraceable() {
    return true;
  }

  command(webElementId, callback) {
    ProtocolAction.validateElementId(webElementId, 'submit');

    return this.transportActions.elementSubmit(webElementId, callback);
  }
};
