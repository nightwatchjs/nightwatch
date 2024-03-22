/**
 * Move to the element and click (without releasing) in the middle of the given element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('button.submit-form').clickAndHold();
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     await browser.element('button.submit-form').clickAndHold();
 *   }
 * }
 *
 * @since 3.0.0
 * @method clickAndHold
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).clickAndHold()
 * @see https://www.w3.org/TR/webdriver#dfn-element-clickAndHold
 * @returns {ScopedWebElement}
 */
module.exports.command = function() {
  return this.runQueuedCommand('pressAndHold');
};
