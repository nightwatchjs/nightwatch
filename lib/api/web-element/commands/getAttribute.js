/**
 * Retrieve the value of an attribute for a given DOM element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding &amp; interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser
 *       .element('#main ul li a.first')
 *       .getAttribute('target')
 *       .assert.valueEquals('_blank');
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#main ul li a.first').getAttribute('href');
 *     console.log('attribute', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getAttribute
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getAttribute(name)
 * @see https://www.w3.org/TR/webdriver#dfn-get-element-attribute
 * @param {string} name The attribute name to inspect.
 * @returns {ScopedValue<string | null>} The value of the attribute
 */
module.exports.command = function(name) {
  return this.runQueuedCommandScoped('getElementValue', name);
};
