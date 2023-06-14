const ProtocolAction = require('./_base-action.js');

/**
 * Get the element on the page that currently has focus. The element will be returned as a [Web Element](https://www.w3.org/TR/webdriver1/#dfn-web-elements) JSON object.
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.elementActive(function(result) {
 *       console.log(result.value)
 *     });
 *   }
 * }
 *
 * @name elementActive
 * @editline L866
 * @link /#get-active-element
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementstate
 * @internal
 */
module.exports = class Session extends ProtocolAction {
  command(callback) {
    return this.transportActions.getActiveElement(callback);
  }
};
