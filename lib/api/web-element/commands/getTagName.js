/**
 * Query for an element's tag name.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const result = browser.element('#login').getTagName();
 *     console.log('element tag:', result);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#login').getTagName();
 *     console.log('element tag:', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getTagName
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getTagName()
 * @see https://www.w3.org/TR/webdriver#dfn-get-element-tag-name
 * @returns {ScopedValue<string>}
 */
module.exports.command = function() {
  return this.runQueuedCommandScoped('getElementTagName');
};
