// Import or declare the types if needed.
// import type { WebElement, ShadowRoot } from 'some-library';

/**
 * Check if the element is present on the page.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const isElementPresent = browser.element('input[name=q]').isPresent();
 *     console.log(isElementPresent); // Returns true or false
 *   }
 * }
 *
 * @since 3.0.0
 * @method isPresent
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.isPresent()
 * @returns {boolean} Returns true if the element is present, false otherwise.
 */
module.exports.command = function() {
  return this.execute(function() {
    // Use the imported or declared types here.
    return this instanceof WebElement || this instanceof ShadowRoot;
  }, [], function(result) {
    return result.value;
  });
};
