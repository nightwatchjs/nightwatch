/**
 * Checks if an element is present in the DOM.
 *
 * This command is useful for verifying the presence of elements that may not be visible or interactable.
 *
 * For more information on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/working-with-page-elements/finding-elements.html">Finding Elements</a> guide page.
 *
 * @example
 * describe('isPresent Demo', function() {
 *   it('test isPresent', function(browser) {
 *     browser.element('#search')
 *       .isPresent()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isPresent', async function(browser) {
 *     const result = await browser.element('#search').isPresent();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.7.1
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isPresent()
 * @returns {ScopedValue<boolean>} A boolean value indicating if the element is present in the DOM.
 */

module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementPresent', {suppressNotFoundErrors: true});
};
