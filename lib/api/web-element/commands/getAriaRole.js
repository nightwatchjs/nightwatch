/**
 * Returns the computed WAI-ARIA role of an element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('*[name="search"]').getAriaRole()
 *       .assert.valueEquals('combobox');
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('*[name="search"]').getAriaRole();
 *     console.log('getAriaRole result', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getAriaRole
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.find(selector).getAriaRole()
 * @syntax browser.element.find(selector).getComputedRole()
 * @link /#get-computed-role
 * @returns {ScopedValue<string>} The container with computed WAI-ARIA role of an element.
 * @alias getComputedRole
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('getElementAriaRole');
};
