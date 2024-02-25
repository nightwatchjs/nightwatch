/**
 * Determines if an element is visible.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the
 * <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * describe('isVisible Demo', function() {
 *
 *   it('test isVisible', function(browser) {
 *     browser.element('#search')
 *       .isVisible()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isVisible', async function(browser) {
 *     const result = await browser.element('#search').isVisible();
 *     browser.assert.equal(result, true)
 *   });
 *
 *   after(browser => browser.end());
 * });
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
  return this.runQueuedCommandScoped('isElementVisible');
};
