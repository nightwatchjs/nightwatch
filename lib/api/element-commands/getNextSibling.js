const BaseElementCommand = require('./_baseElementCommand.js');
/**
 * Returns the element immediately following the specified one in their parent's childNodes. The element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.getNextSibling('.features-container li:first-child');
 *
 *     console.log('next sibling element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.getNextSibling(selector, callback)
 * @syntax browser.getNextSibling(selector)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @method getNextSibling
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling
 * @since 2.0.0
 * @api protocol.elements
 * @exampleLink /api/getNextSibling.js
 */
class GetNextSibling extends BaseElementCommand {
    
  get extraArgsCount() {
    return 0;
  }
  
  async protocolAction() {
    return await this.executeProtocolAction('getNextSibling');
  }
}

module.exports = GetNextSibling;