const {LocateStrategy} = require('../../element');
const ProtocolAction = require('./_base-action.js');

/**
 * Search for an element on the page, starting from the identified element. The located element will be returned as a Web Element JSON object.
 *
 * This command operates on a protocol level and requires a [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements). Read more on [Element retrieval](https://www.w3.org/TR/webdriver1/#element-retrieval) on the W3C WebDriver spec page.
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.elementIdElement('<WebElementId>', 'css selector', '.new-element', function(result) {
 *       console.log(result.value)
 *     });
 *   },
 *
 *   'es6 async demo Test': async function(browser) {
 *     const result = await browser.elementIdElement('<WebElementId>', 'css selector', '.new-element');
 *     console.log(result.value);
 *   },
 *
 *   'page object demo Test': function (browser) {
 *      var nightwatch = browser.page.nightwatch();
 *      nightwatch.navigate();
 *
 *      const navbarHeader = nightwatch.section.navbarHeader;
 *
 *      navbarHeader.api.elementIdElement('@versionDropdown', 'css selector', 'option', function(result) {
 *        browser.assert.ok(client.WEBDRIVER_ELEMENT_ID in result.value, 'The Webdriver Element Id is found in the result');
 *      });
 *   }
 * }
 *
 * @link /#find-element-from-element
 * @syntax .elementIdElement(webElementId, using, value, callback)
 * @editline L794
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @param {function} callback Callback function which is called with the result value.
 * @internal
 * @api protocol.elements
 */
const Element = require('../../element');

module.exports = class Session extends ProtocolAction {
  command(webElementId, using, value, callback = function (r) {return r}) {
    const commandName = 'elementIdElement';

    if (webElementId instanceof Element) {
      return this.findElements({
        parentElement: webElementId,
        callback,
        using,
        value,
        commandName
      });
    }

    ProtocolAction.validateElementId(webElementId, commandName);
    LocateStrategy.validate(using, commandName);

    return this.findElements({
      id: webElementId, using, value, commandName, callback
    });
  }
};
