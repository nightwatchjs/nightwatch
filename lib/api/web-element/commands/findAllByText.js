const {By} = require('selenium-webdriver');

/**
 * Search for elements on the page that contain a specified text.
 * Elements can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring matching.
 *     const inputs = browser.element.findAllByText('group of people');
 *
 *     // Search for the exact occurrence.
 *     const images = browser.element.findAllByText(
 *       'The nostalgic office',
 *       { exact: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findAllByText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findAllByText(text, [options])
 * @param {string} text
 * @param {{exact: boolean}} [options]
 * @returns {Array.<ScopeWebElement>}
 */
module.exports.command = function (text, {exact = true} = {}) {
  const expr = exact ? `text()="${text}"` : `contains(text(),"${text}")`;
  const selector = By.xpath(`.//*[${expr}]`);

  return this.createScopedElements({selector}, {parentElement: this, commandName: 'findAllByText'});
};
