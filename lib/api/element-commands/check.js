const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Will check, by clicking, on a checkbox or radio input if it is not already checked.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.check('input[type=checkbox]:not(:checked)');
 *
 *     browser.check('input[type=checkbox]:not(:checked)', function(result) {
 *       console.log('Check result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.check('css selector', 'input[type=checkbox]:not(:checked)');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.check({
 *       selector: 'input[type=checkbox]:not(:checked)',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.check({
 *       selector: 'input[type=checkbox]:not(:checked)',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.check('input[type=checkbox]:not(:checked)');
 *     console.log('Check result', result);
 *   }
 * }
 *
 * @method check
 * @syntax .check(selector, [callback])
 * @syntax .check(using, selector, [callback])
 * @syntax browser.element(selector).check()
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol.elementinteraction
 */
class CheckElement extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'checkElement';
  }

  static get isTraceable() {
    return true;
  }

  async protocolAction() {
    return this.executeProtocolAction(this.elementProtocolAction);
  }
}

module.exports = CheckElement;
