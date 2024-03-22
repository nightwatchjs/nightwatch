/**
 * Returns the element ID
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const elementId = browser.element('#main').getId();
 *     console.log('element id:', elementId)
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const elementId = await browser.element('#main').getId();
 *     console.log('element id:', elementId);
 *   },
 * }
 *
 * @since 3.0.0
 * @method getId
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getId()
 * @returns {ScopedValue<string>}
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped(function (webElement) {
    return webElement.getId();
  });
};
