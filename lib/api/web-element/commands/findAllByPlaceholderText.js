const {By} = require('selenium-webdriver');

/**
 * Search for elements on the page that have the `placeholder` attribute with a specified text.
 * Elements can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring matching.
 *     const inputs = browser.element.findAllByPlaceholderText('group of people');
 *
 *     // Search for the exact occurrence.
 *     const images = browser.element.findAllByPlaceholderText(
 *       'Search here',
 *       { exact: true }
 *     );
 *
 *     const images = browser.element.findAllByPlaceholderText(
 *       'Enter the number',
 *       { exact: true, suppressNotFoundError: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findAllByPlaceholderText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findAllByPlaceholderText(text, [options])
 * @param {string} text
 * @param { {exact: boolean, index: number, timeout: number, retryInterval: number, suppressNotFoundErrors: boolean} } [options]
 * @returns {Array.<ScopeWebElement>}
 */
module.exports.command = function (text, {exact = true, ...options} = {}) {
  const comparingModifier = exact ? '' : '*';

  return this.findAll({
    ...options,
    selector: By.css(`[placeholder${comparingModifier}="${text}"]`)
  });
};
