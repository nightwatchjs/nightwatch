/**
 * Returns element related to text . The element will be returned as web element JSON object (with an added .getId() convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.findElementByText('Nightwatch');
 *
 *     console.log('element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.findElementByText(text, callback)
 * @syntax browser.findElementByText(text)
 * @param {string} text The text used to locate the element. Can be a string
 * @param {object} {exact: true} Used to exact match of text
 * @param {function} callback Callback function which is called with the result value.
 * @method findElementByText
 * @since 2.0.0
 * @api protocol.elements
 */

const LocateStrategy = require('../../element/strategy.js');
const FindElement = require('./findElement.js');

class FindElementByText extends FindElement {
  get selector() {
    if (this.args[1] && this.args[1].exact === true) {
      return `//${this.__selector}[text()='${this.args[0]}']`;
    }

    return `//${this.__selector}[contains(text(), '${this.args[0]}')]`;
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

module.exports = FindElementByText;