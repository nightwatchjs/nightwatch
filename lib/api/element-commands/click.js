const {AssertionRunner} = require('../../assertion');
const BaseElementCommand = require('./_baseElementCommand.js');
const {LocateStrategy, Command: ElementCommand} = require('../../element');
const Utils = require('../../utils');

/**
 * Simulates a click event on the given DOM element. The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for <a href="https://www.w3.org/TR/webdriver/#element-interactability" target="_blank">element interactability</a>.
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
 *     // with custom message
 *     browser.click('#main ul li a.first', 'element clicked');
 * 
 *     browser.click('css selector', '#main ul li a.first', 'css selector clicked');
 * 
 *     browser.click('#main ul li a.first', function(result) {
 *       console.log('Click result', result);
 *     }, 'css selector clicked');
 * 
 *     browser.click('css selector', '#main ul li a.first', function(result) {
 *       console.log('Click result', result);
 *     }, 'clicked upload button');
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
 * @param {string} [message] Optional message to be shown in the output; the message supports two placeholders: %s for current selector and %d for the time (e.g. Element %s was not in the page for %d ms).
 * @api protocol.elementinteraction
 * @link /#dfn-element-click
 */
class ClickElement extends BaseElementCommand {
  get minArgsCount() {
    return 1;
  } 

  get maxArgsCount() {
    return 4;
  } 

  validateArgsCount() {
    if (this.args.length < this.minArgsCount || this.args.length > this.maxArgsCount) {
      throw new Error(`${this.commandName} method expects betweeen ${(this.minArgsCount)} `+
        `to  ${(this.maxArgsCount)} arguments - ${this.args.length} given.`);
    }

    if (LocateStrategy.isValid(this.args[0]) && (Utils.isString(this.args[1]) || ElementCommand.isSelectorObject(this.args[1]))) {
      this.setStrategyFromArgs();
    }
  }

  get elementProtocolAction() {
    return 'clickElement';
  }
  
  async successHandler(result){
    const {reporter} = this.client;
    const {message} = this;
    const passed = true;
    const err = {};

    const runner = new AssertionRunner({
      passed,
      err,
      message,
      reporter
    });

    return runner.run(result)
      .catch(err => (err))
      .then(err => {
        if (err instanceof Error) {
          err.abortOnFailure = this.abortOnFailure;

          return this.complete(err, result);
        }

        return this.complete(null, result);
      });
  } 
}

module.exports = ClickElement;
