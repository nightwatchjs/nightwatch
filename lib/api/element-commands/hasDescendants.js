const BaseElementCommand = require('./_baseElementCommand.js');
/**
 * Returns true or false based on whether the DOM has any child nodes
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const result = await browser.hasDescendants('.features-container');
 *
 *     console.log('true or false:', result);
 *   },
 *
 * @syntax browser.hasDescendants(selector, callback)
 * @syntax browser.hasDescendants(selector)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @method hasDescendants
 * @api protocol.elementstate
 * @since 2.0.0
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/childElementCount
 */
class HasDescendants extends BaseElementCommand {

  async protocolAction() {
    return await this.executeProtocolAction('elementHasDescendants');
  }

}

module.exports = HasDescendants;

