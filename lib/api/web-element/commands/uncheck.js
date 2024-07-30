/**
 * Will uncheck, by clicking, on a checkbox or radio input if it is not already unchecked.
 * The element is scrolled into view if it is not already pointer-interactable. See the WebDriver specification for <a href="https://www.w3.org/TR/webdriver/#element-interactability" target="_blank">element interactability</a>.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('input[type=checkbox]:checked)').check();
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('input[type=checkbox]:checked)').check();
 *   },
 * }
 *
 * @since 3.7.0
 * @method uncheck
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).check()
 * @returns {ScopedWebElement}
 */
module.exports.command = function () {
  return this.runQueuedCommand('uncheckElement');
};
