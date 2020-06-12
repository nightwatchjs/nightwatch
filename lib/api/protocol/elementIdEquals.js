const ProtocolAction = require('./_base-action.js');

/**
 * Test if two web element IDs refer to the same DOM element.
 *
 * This command is __deprecated__ and is only available on the [JSON Wire protocol](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#sessionsessionidelementidequalsother)
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.elementIdEquals('<ID-1>', '<ID-2>', function(result) {
 *       console.log(result.value)
 *     });
 *   }
 * }
 *
 * @link /#finding-elements-to-interact
 * @editline L772
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {string} otherId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the other element to compare against.
 * @param {function} callback Callback function which is called with the result value.
 * @internal
 * @api protocol.elements
 */
module.exports = class Session extends ProtocolAction {
  command(webElementId, otherId, callback) {
    ProtocolAction.validateElementId(webElementId, 'elementIdEquals');

    return this.transportActions.elementIdEquals(webElementId, otherId, callback);
  }
};
