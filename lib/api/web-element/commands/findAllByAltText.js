const {By} = require('selenium-webdriver');

/**
 * Search for elements on the page that have the `alt` attribute with a specified text.
 * Elements can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring matching.
 *     const images = browser.element.findAllByAltText('group of people');
 *
 *     // Search for the exact occurrence.
 *     const images = browser.element.findAllByAltText(
 *       'A group of people sitting in front of a computer.',
 *       { exact: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findAllByAltText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findAllByAltText(text, [options])
 * @param {string} text
 * @param {{exact: boolean}} [options]
 * @returns {Array.<ScopedWebElement>}
 */
module.exports.command = function (text, {exact = true, ...options} = {}) {
  const comparingModifier = exact ? '' : '*';

  return this.findAll({
    ...options,
    selector: By.css(`[alt${comparingModifier}="${text}"]`)
  });
};
