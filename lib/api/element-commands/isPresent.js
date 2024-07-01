const BaseElementCommand = require('./_baseElementCommand.js');
const {Logger, filterStackTrace} = require('../../utils');
/**
 * Determines if an element is present in the DOM.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.isPresent('#main ul li a.first', function(result) {
 *       this.assert.equal(typeof result, "object");
 *       this.assert.equal(result.status, 0);
 *       this.assert.equal(result.value, true);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.isPresent('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties
 *     browser.isPresent({
 *       selector: '#main ul li a',
 *       index: 1,
 *     });
 *
 *     browser.isPresent({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.isPresent('#main ul li a.first');
 *     console.log('isPresent result', result);
 *   }
 * }
 *
 * @method isPresent
 * @syntax .isPresent(selector, callback)
 * @syntax .isPresent(using, selector, callback)
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string|object} selector The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {function} callback Callback function which is called with the result value.
 * @api protocol.elementstate
 */
class isPresent extends BaseElementCommand {
  elementLocateError(error) {
    if (error.response) {
      error.detailedErr  = JSON.stringify(error.response);
    }
    error.stack = filterStackTrace(this.stackTrace);
    Logger.error(error);

    return this.complete(null, {
      status: 0,
      value: false
    });
  }

  async protocolAction() {
    const result = {
      status: 0,
      value: false
    };

    if (this.webElement || this.elementId) {
      result.value = true;
    }

    return result;
  }

}

module.exports = isPresent;
