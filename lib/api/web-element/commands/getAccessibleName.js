/**
 * Returns the computed WAI-ARIA label of an element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('*[name="search"]')
 *       .getAccessibleName()
 *       .assert.valueEquals('Country calling code');
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result: string = await browser.element('*[name="search"]').getAccessibleName();
 *     console.log('getAccessibleName is ', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getAccessibleName
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getAccessibleName()
 * @see https://www.w3.org/TR/webdriver#dfn-get-computed-label
 * @returns {ScopedValue<string>} A container with accessible name of an element.
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('getElementAccessibleName');
};
