const Utils = require('./../../../utils/index.js');

/**
 * Simulates a click event on the given DOM element.
 * The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for <a href="https://www.w3.org/TR/webdriver/#element-interactability" target="_blank">element interactability</a>.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('button.submit-form').click();
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('button.submit-form').click();
 *   }
 * }
 *
 * @since 3.0.0
 * @method click
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).click()
 * @link /#dfn-element-click
 * @returns {ScopedWebElement}
 */
module.exports.command = function (commandArgs = {}) {
  if (!Utils.isObject(commandArgs) || Array.isArray(commandArgs)) {
    var type =  Array.isArray(commandArgs) ? 'array' : typeof commandArgs;
    throw new Error(`First argument passed to .click() must be an object; received: ${type} (${commandArgs}).`);
  }

  const {force = false} = commandArgs;

  return this.runQueuedCommand('clickElement', {
    args: [force]
  });
};
