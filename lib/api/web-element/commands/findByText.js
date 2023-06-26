const {By} = require('selenium-webdriver');

/**
 * Search for an element on the page that contains a specified text.
 * Element can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring matching.
 *     const inputs = browser.element.findByText('group of people');
 *
 *     // Search for the exact occurrence.
 *     const images = browser.element.findByText(
 *       'The nostalgic office',
 *       { exact: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findByText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findByText(text, [options])
 * @param {string} text
 * @param {{exact: boolean}} [options]
 * @returns {ScopedWebElement}
 */
module.exports.command = function(text, {exact = true, ...options} = {}) {
  const selector = exact
    ? By.xpath(`.//*[text()="${text}"]`)
    : By.xpath(`.//*[contains(text(),"${text}")]`);

  return this.find({
    ...options,
    selector
  });
};
