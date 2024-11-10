/**
 * Determines if an element is currently active/focused in the DOM.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 * For more info on the new `browser.element.find()` syntax, refer to the <a href="/api/element/"> new Element API Overview </a> page.
 *
 * @example
 * describe('isActive Demo', function() {
 *   it('test isActive', function(browser) {
 *     browser.element.find('#search')
 *       .isActive()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isActive', async function(browser) {
 *     const result = await browser.element.find('#search').isActive();
 *     browser.assert.equal(result, true);
 *   });
 * });
 *
 * @since 3.9.0
 * @method isActive
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.find(selector).isActive()
 * @link /#get-active-element
 * @returns {ScopedValue<boolean>}
 */
module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementActive');
};
