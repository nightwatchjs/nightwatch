/**
 * Determines if an element is present.
 *
 * For more information on working with DOM elements in Nightwatch, refer to the [Finding & interacting with DOM Elements guide](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html).
 *
 * @example
 * // Using synchronous mode
 * describe('isPresent Demo', function() {
 *   it('test isPresent', function(browser) {
 *     browser.element('#search')
 *       .isPresent()
 *       .assert.equals(true);
 *   });
 *
 *   // Using asynchronous mode
 *   it('test async isPresent', async function(browser) {
 *     const result = await browser.element('#search').isPresent();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.5.0
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isPresent()
 * @see [WebDriver specification: is element present](https://www.w3.org/TR/webdriver/#is-element-present)
 * @returns {ScopedValue<boolean>} A scoped value representing whether the element is present.
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('isElementPresent');
};
