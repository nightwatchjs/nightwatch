const BaseElementCommand = require('./_baseElementCommand.js');
/**
 *  Returns the element immediately preceding the specified one in its parent's child elements list. The element will be returned as web element JSON object (with an added `.getId()` convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.getPreviousSibling('.features-container li:second-child');
 *
 *     console.log('previous sibling element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.getPreviousSibling('#web-button', function(result) {
 *
 *   console.log(result.value)
 * }})
 * await browser.getPreviousSibling('#web-button')
 * await browser.getPreviousSibling({selector: '#web-button', locateStrategy: 'css selector'})
 *
 * @syntax
 * // with global element():
 * const formEl = element('form');
 * const result = await browser.getPreviousSibling(formEl)
 *
 * @syntax
 * // with Selenium By() locators
 * // https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html
 * const locator = by.tagName('form');
 * const result = await browser.getPreviousSibling(locator)
 *
 * @syntax
 * // with browser.findElement()
 * const formEl = await browser.findElement('form');
 * const result = await browser.getPreviousSibling(formEl)
 *
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @method getPreviousSibling
 * @returns {object} The resolved element object, which contains a convenience `.getId()` method that can be used to retrieve the element ID
 * @since 2.0.0
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling
 * @api protocol.elements
 */
class GetPreviousSibling extends BaseElementCommand {
    
  get extraArgsCount() {
    return 0;
  }
  
  async protocolAction() {
    return this.executeProtocolAction('getPreviousSibling');
  }
}

module.exports = GetPreviousSibling;