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
 * @method findElementByLabel
 * @since 2.0.0
 * @moreinfo developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild
 * @api protocol.elements
 */

const {WebElement} = require('selenium-webdriver');
const LocateStrategy = require('../../element/strategy.js');
const Utils = require('../../utils/index.js');
const FindElement = require('../element-commands/findElement.js');
const ProtocolAction = require('./_base-action.js');
 
class FindElementWithChildCSS  extends ProtocolAction {
  async command(...args) {
    let text; let exactMatch;

    if (args.length === 2 && Utils.isString(args[1])) {
      text = args.pop();
    } else if (args.length === 3 && Utils.isString(args[2])) {
      text = args.pop();
    } else if (args.length === 4) {
      [text, exactMatch] = args.splice(1, 2);
    }

    if (!text) {
      throw new Error('findElementWithChildText method expects text as string in arguments');
    }

    const elements = await this.api.findElements(...args);
    const {driver} = this.transport;

    const res = await elements.find(async element => {
      const webElement = new WebElement(driver, element.getId());

      if ((await webElement.getAttribute('textContent')).includes(text)) {
        return element;
      }
    });

    return res;
  }
}

module.exports = FindElementWithChildCSS;