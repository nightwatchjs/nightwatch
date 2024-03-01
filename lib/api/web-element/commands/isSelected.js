/**
 * Determines if an element is selected.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * describe('isSelected Demo', function() {
 *   it('test isSelected', function(browser) {
 *     browser.element('#search')
 *       .isSelected()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isSelected', async function(browser) {
 *     const result = await browser.element('#search').isSelected();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.5.0
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
