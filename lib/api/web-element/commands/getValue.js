/**
 * Returns a form element current value.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const result = browser.element('#login input[type=text]').getValue();
 *     console.log('Value', result);
 *   },
 *
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#login input[type=text]').getValue();
 *     console.log('Value', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getValue
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getValue()
 * @see https://www.w3.org/TR/webdriver#dfn-get-element-tag-name
 * @returns {ScopedValue<string>}
 */
module.exports.command = function () {
  return this.getProperty('value');
};
