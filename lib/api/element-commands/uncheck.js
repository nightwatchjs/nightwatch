const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Will uncheck, by clicking, on a checkbox or radio input if it is not already unchecked.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.uncheck('input[type=checkbox]:checked)');
 *
 *     browser.uncheck('input[type=checkbox]:checked)', function(result) {
 *       console.log('Check result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.uncheck('css selector', 'input[type=checkbox]:checked)');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.uncheck({
 *       selector: 'input[type=checkbox]:checked)',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.uncheck({
 *       selector: 'input[type=checkbox]:checked)',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.uncheck('input[type=checkbox]:checked)');
 *     console.log('Check result', result);
 *   }
 * }
 *
 * @method check
 * @syntax .uncheck(selector, [callback])
 * @syntax .uncheck(using, selector, [callback])
 * @syntax browser.element(selector).uncheck()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 */
class UncheckElement extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'uncheckElement';
  }

  static get isTraceable() {
    return true;
  }

  async protocolAction() {
    return this.executeProtocolAction(this.elementProtocolAction);
  }
}

module.exports = UncheckElement;
