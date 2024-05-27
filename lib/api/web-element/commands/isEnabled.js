/**
 * Determines if an element is enabled.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * describe('isEnabled Demo', function() {
 *   it('test isEnabled', function(browser) {
 *     browser.element('#search')
 *       .isEnabled()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isEnabled', async function(browser) {
 *     const result = await browser.element('#search').isEnabled();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.5.0
 * @method isEnabled
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isEnabled()
 * @link /#is-element-enabled
 * @returns {ScopedValue<boolean>}
 */
module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementEnabled');
};
