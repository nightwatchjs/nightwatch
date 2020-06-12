const {LocateStrategy} = require('../../element');
const ProtocolAction = require('./_base-action.js');

/**
 * Search for multiple elements on the page, starting from the identified element. The located element will be returned as a web element JSON objects.
 *
 * @example
 * module.exports = {
 *  'demo Test' : function(browser) {
 *     browser.elementIdElements('<WebElementId>', 'css selector', 'ul li', function(result) {
 *       console.log(result.value)
 *     });
 *   },
 *
 *   'es6 async demo Test': async function(browser) {
 *     const result = await browser.elementIdElements('<WebElementId>', 'css selector', 'ul li');
 *     console.log(result.value);
 *   },
 *
 *   'page object demo Test': function (browser) {
 *      var nightwatch = browser.page.nightwatch();
 *      nightwatch.navigate();
 *
 *      const navbarHeader = nightwatch.section.navbarHeader;
 *
 *      navbarHeader.api.elementIdElements('@versionDropdown', 'css selector', 'option', function(result) {
 *        browser.assert.equal(result.value.length, 2, 'There are two option elements in the drop down');
 *      });
 *   }
 * }
 *
 *
 * @link /#find-elements-from-element
 * @syntax .elementIdElements(webElementId, using, value, callback)
 * @editline L840
 * @param {string} webElementId The [Web Element ID](https://www.w3.org/TR/webdriver1/#dfn-web-elements) of the element to route the command to.
 * @param {string} using The locator strategy to use.
 * @param {string} value The search target.
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elements
 * @internal
 */
const Element = require('../../element');

module.exports = class Session extends ProtocolAction {
  command(webElementId, using, value, callback = function (r) {return r}) {
    const commandName = 'elementIdElements';

    if (webElementId instanceof Element) {
      return this.findElements({
        parentElement: webElementId,
        callback,
        using,
        value,
        commandName
      });
    }

    ProtocolAction.validateElementId(webElementId, 'elementIdElements');
    LocateStrategy.validate(using, 'elementIdElements');

    return this.findElements({
      id: webElementId, using, value, commandName, callback
    });
  }
};
