/**
 * Determines if an element is present in the DOM.
 *
 * @example
 * describe('isPresent Demo', function() {
 *   it('test isPresent', function(browser) {
 *     browser.element('#search')
 *       .isPresent()
 *
 *
 *   it('test async isPresent', async function(browser) {
 *     const result = await browser.element('#search').isPresent();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.0.0
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isPresent()
 * @see https://www.w3.org/TR/webdriver#is-element-present
 * @returns {ScopedValue<boolean>}
 */

module.exports.command = function () {
    return this.runQueuedCommandScoped('isElementPresent');
};