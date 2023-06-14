const {By} = require('selenium-webdriver');

/**
 * Search for an element on the page that have the `placeholder` attribute with a specified text.
 * Element can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring matching.
 *     const inputs = browser.element.findByPlaceholderText('group of people');
 *
 *     // Search for the exact occurrence.
 *     const images = browser.element.findByPlaceholderText(
 *       'Search here',
 *       { exact: true }
 *     );
 *
 *     const images = browser.element.findByPlaceholderText(
 *       'Enter the number',
 *       { exact: true, suppressNotFoundError: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findByPlaceholderText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findByPlaceholderText(text, [options])
 * @param {string} text
 * @param {{exact: boolean}} [options]
 * @returns {ScopedWebElement}
 */
module.exports.command = function (text, {exact = true, ...options} = {}) {
  const comparingModifier = exact ? '' : '*';

  return this.find({
    ...options,
    selector: By.css(`[placeholder${comparingModifier}="${text}"]`)
  });
};
