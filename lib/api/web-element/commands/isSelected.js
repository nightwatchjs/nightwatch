/**
 * Determines if an element is selected.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * describe('isSelected Demo', function() {
 *   before(browser => {
 *     browser
 *       .navigateTo('https://www.ecosia.org/');
 *   });
 *
 *   it('Demo test ecosia.org', function(browser) {
 *     browser
 *       .waitForElementVisible('body')
 *       .element('.search-form__input-wrapper')
 *       .isSelected(function callback(result) {
 *         assert.strictEqual(result.value, true);
 *       });
 *   });
 *
 *   after(browser => browser.end());
 * });
 *
 * @since 3.0.0
 * @method isSelected
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isSelected()
 * @see https://www.w3.org/TR/webdriver/#is-element-selected
 * @returns {ScopedValue<boolean>}
 */
module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementSelected');
};
