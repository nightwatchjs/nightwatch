/**
 * Checks if an element is present in the DOM.
 *
 * This command is useful for verifying the presence of elements that may/may not be visible or interactable.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 * For more info on the new `browser.element.find()` syntax, refer to the <a href="/api/element/"> new Element API Overview </a> page.
 *
 * @example
 * describe('isPresent Demo', function() {
 *   it('test isPresent', function(browser) {
 *     browser.element.find('#search')
 *       .isPresent()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isPresent', async function(browser) {
 *     const result = await browser.element.find('#search').isPresent();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.7.1
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.find(selector).isPresent()
 * @returns {ScopedValue<boolean>} A boolean value indicating if the element is present in the DOM.
 */

module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementPresent', {suppressNotFoundErrors: true});
};
