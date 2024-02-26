/**
 * Determine an element's size in pixels.
 *
 * For W3C Webdriver compatible clients (such as GeckoDriver), this command is equivalent to `getLocation` and both return the dimensions and coordinates of the given element:
 * - x: X axis position of the top-left corner of the element, in CSS pixels
 * - y: Y axis position of the top-left corner of the element, in CSS pixels
 * - height: Height of the element’s bounding rectangle in CSS pixels;
 * - width: Width of the web element’s bounding rectangle in CSS pixels.
 *
 * For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
 *
 * @example
 * describe('isPresent Demo', function() {
 *
 *   it('test isPresent', function(browser) {
 *     browser.element('#login')
 *       .isPresent()
 *       .assert.equals(true);
 *   });
 *
 *   it('test async isPresent', async function(browser) {
 *     const result = await browser.element('#login').isPresent();
 *     browser.assert.equal(result, true)
 *   });
 *
 *   after(browser => browser.end());
 * });
 *
 * @since 3.5.0
 * @method getRect
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element(selector).isPresent()
 * @see https://www.w3.org/TR/webdriver#dfn-get-element-rect
 * @returns {ScopedValue<boolean>}
 */
module.exports.command = function () {
  return this.runQueuedCommandScoped('isElementPresent');
};
