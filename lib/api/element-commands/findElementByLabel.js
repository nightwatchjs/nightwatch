/**
 * Returns input element related to label . The element will be returned as web element JSON object (with some convenience method).
 *
 *
 * @example
 * module.exports = {
 *  'demo Test': function(browser) {
 *     const resultElement = await browser.findElementByLabel('username');
 *
 *     console.log('element Id:', resultElement.getId());
 *   },
 *
 * @syntax browser.findElementByLabel(label_text, callback)
 * @syntax browser.findElementByLabel(label_text)
 * @param {string} label_text The label_text used to locate the input element. Can be a string
 * @param {object} {exact: true} Used to exact match of label_text
 * @param {function} callback Callback function which is called with the result value.
 * @method findElementByLabel
 * @since 2.0.0
 * @api protocol.elements
 */

const LocateStrategy = require('../../element/strategy.js');
const FindElement = require('./findElement.js');

class FindElementByLabel extends FindElement {
  get selector() {
    if (this.args[1] && this.args[1].exact === true) {
      return `//${this.__selector}[text()='${this.args[0]}']//following::input[1]`;
    }

    return `//${this.__selector}[contains(text(), '${this.args[0]}')]//following::input[1]`;
  }

  setStrategy() {
    this.__strategy = LocateStrategy.XPATH;

    return this;
  }

  setStrategyFromArgs() {}
}

module.exports = FindElementByLabel;