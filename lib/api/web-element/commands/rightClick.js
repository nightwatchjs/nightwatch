/**
 * Simulates a context-click(right click) event on the given DOM element. The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for element [interactability](https://www.w3.org/TR/webdriver/#element-interactability).
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#main ul li a.first').rightClick();
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('#main ul li a.first').rightClick();
 *   }
 * }
 *
 * @since 3.0.0
 * @method rightClick
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).rightClick()
 * @see https://www.w3.org/TR/webdriver#dfn-element-rightclick
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  return this.runQueuedCommand('contextClick');
};
