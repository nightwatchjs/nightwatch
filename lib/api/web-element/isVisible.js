/**
 * Returns the visible text for the element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const result = browser.element('#main ul li a.first').isVisible();
 *       .assert.valueEquals('custom text');
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#main ul li a.first').isVisible();
 *     console.log('element text:', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isVisible()
 * @see https://www.w3.org/TR/webdriver#dfn-get-element-text
 * @returns {ScopedValue<string>}
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('isElementDisplayed');
};
