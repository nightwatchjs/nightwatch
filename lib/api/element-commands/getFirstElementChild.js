const BaseElementCommand = require('./_baseElementCommand.js');
/**
 * Returns an element's first child. The child element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.getFirstElementChild('.features-container');
 *
 *     console.log('last child element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.getFirstElementChild(selector, callback)
 * @syntax browser.getFirstElementChild(selector)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @method getFirstElementChild
 * @since 2.0.0
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild
 * @api protocol.elements
 */
class GetFirstElementChild extends BaseElementCommand {
    
  get extraArgsCount() {
    return 0;
  }

  async protocolAction() {
    const result = await this.executeProtocolAction('getFirstElementChild');

    return result;
  }
}

module.exports = GetFirstElementChild;