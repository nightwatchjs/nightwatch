/**
 * Determines if an element is visible.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the
 * <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const result = browser.element('#main').isVisible();
 *       .assert.equals(true);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#main').isVisible();
 *     browser.assert.equal(result,true)
 *   }
 * }
 *
 * @since 3.0.0
 * @method isVisible
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isVisible()
 * @see https://www.w3.org/TR/webdriver/#is-element-visible
 * @returns {ScopedValue<boolean>}
 * @alias isDisplayed
 */
module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementDisplayed');
};
