const BaseElementCommand = require('./_baseElementCommand.js');

/**
 * Simulates a click event on the given DOM element. The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for <a href="https://www.w3.org/TR/webdriver/#element-interactability" target="_blank">element interactability</a>.
 *
 * Starting with v1.1 `click()` will also wait for the element to be present (until the specified timeout). * If the element is not found, an error is thrown which will cause the test to fail. Starting with `v1.2` you can suppress element not found errors by specifying the `suppressNotFoundErrors` flag.
 *
 * @example
 * module.exports = {
 *   demoTest(browser) {
 *     browser.click('#main ul li a.first');
 *
 *     browser.click('#main ul li a.first', function(result) {
 *       console.log('Click result', result);
 *     });
 *
 *     // with explicit locate strategy
 *     browser.click('css selector', '#main ul li a.first');
 *
 *     // with selector object - see https://nightwatchjs.org/guide#element-properties
 *     browser.click({
 *       selector: '#main ul li a',
 *       index: 1,
 *       suppressNotFoundErrors: true
 *     });
 *
 *     browser.click({
 *       selector: '#main ul li a.first',
 *       timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
 *     });
 *   },
 *
 *   demoTestAsync: async function(browser) {
 *     const result = await browser.click('#main ul li a.first');
 *     console.log('Click result', result);
 *   }
 * }
 *
 * @method click
 * @syntax .click(selector, [callback])
 * @syntax .click(using, selector, [callback])
 * @param {string} [using] The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies)
 * @param {string} selector The CSS/Xpath selector used to locate the element.
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see elementIdClick
 * @api protocol.elementinteraction
 */
class ClickElement extends BaseElementCommand {
  get extraArgsCount() {
    return 0;
  }

  get elementProtocolAction() {
    return 'clickElement';
  }
}

module.exports = ClickElement;
