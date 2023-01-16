/**
 * Returns input element related to placeholder . The element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.findElementByPlaceholderText('sign-in');
 *
 *     console.log('element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.findElementByPlaceholderText(placeholder_text, callback)
 * @syntax browser.findElementByPlaceholderText(placeholder_text)
 * @param {string} placeholder_text The placeholder_text used to locate the input element. Can be a string
 * @param {object} {exact: true} Used to exact match of placeholder_text
 * @param {function} callback Callback function which is called with the result value.
 * @method findElementByPlaceholderText
 * @since 2.0.0
 * @api protocol.elements
 */

const LocateStrategy = require('../../element/strategy.js');
const FindElement = require('./findElement.js');

class FindElementByPlaceholderText extends FindElement {
  get selector() {
    if (this.args[1] && this.args[1].exact === true) {
      return `//input[@placeholder='${this.args[0]}']`;
    }

    return `//input[contains(@placeholder, '${this.args[0]}')]`;
  }

  setStrategy() {
    this.__strategy = LocateStrategy.XPATH;

    return this;
  }

  setStrategyFromArgs() { }

  get selectorPassed() {
    return false;
  }
}

module.exports = FindElementByPlaceholderText;