/**
 * Retrieve the value of a CSS property for a given DOM element.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @tsexample
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     browser.element('#main ul li a.first').getCssProperty('display')
 *       .assert.valueEquals('block');
 *   },
 *   async demoTestAsync(browser: NightwatchAPI): Promise<void> {
 *     const result = await browser.element('#main ul li a.first').getCssProperty('display');
 *     console.log('display', result);
 *   }
 * }
 *
 * @example
 * export default {
 *   demoTest({ element }) {
 *     element('#main ul li a.first')
 *       .getCssProperty('display')
 *       .assert.valueEquals('block');
 *   },
 *
 *   async demoTestAsync({ element }) {
 *     const result = await element('#main ul li a.first').getCssProperty('display');
 *     console.log('display', result);
 *   }
 * }
 *
 * @since 3.0.0
 * @method getCssProperty
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).getCssProperty(name)
 * @link /#get-element-css-value
 * @param {string} cssProperty The CSS property to inspect.
 * @returns {ScopedValue<string>} The container with a value of the css property
 */
module.exports.command = function(cssProperty) {
  return this.runQueuedCommandScoped('getElementCSSValue', cssProperty);
};
