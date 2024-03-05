/**
 * Checks if the element is present in the DOM.
 *
 * This command is useful for verifying the presence of elements without causing the test to fail if the element is not found.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#some-element').isPresent(result => {
 *       console.log('Is element present:', result.value);
 *     });
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const isPresent = await browser.element('#some-element').isPresent();
 *     console.log('Is element present:', isPresent);
 *   }
 * }
 *
 * @since 3.x.x  // Adjust based on your next version
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isPresent()
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating the presence of the element.
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('isElementPresent')
    .then(result => result.value)
    .catch(() => false);
};
