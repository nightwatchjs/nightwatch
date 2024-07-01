const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Returns an element's last child. The child element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.getLastElementChild('.features-container');
 *
 *     console.log('last child element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.getLastElementChild(selector, callback)
 * @syntax browser.getLastElementChild(selector)
 * @syntax browser.element(selector).getLastElementChild()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @method getLastElementChild
 * @since 2.0.0
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/lastElementChild
 * @api protocol.elements
 */
class GetLastElementChild extends BaseElementCommand {

  get extraArgsCount() {
    return 0;
  }

  async protocolAction() {
    return this.executeProtocolAction('getLastElementChild');
  }
}

module.exports = GetLastElementChild;
