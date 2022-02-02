const {AssertionRunner} = require('../../assertion');
const BaseElementCommand = require('./_baseElementCommand.js');
const {LocateStrategy, Command: ElementCommand} = require('../../element');
const Utils = require('../../utils');
const {Logger} = Utils;
const {colors} = Logger;

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
 * @param {string} [message] Optional message to be shown in the output in case of success
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
    let waiter = await this.complete(null, result);
    Logger.logDetailedMessage(`  ${colors.green(Utils.symbols.ok)} ${this.message}`);

    return waiter;
  } 
}

module.exports = ClickElement;
