const {By} = require('selenium-webdriver');

/**
 * Search for an element on the page that has the `alt` attribute with a specified text.
 * Element can be searched by using another element as the starting point.
 * By default, provided text is treated as a substring, so for the `'foo'` will match `'foobar'` also.
 * If you need an exact comparison, provide the `{ exact: true }` as the second parameter.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     // Search by the substring mathing.
 *     const image = browser.element.findByAltText('group of people');
 *
 *     // Search for the exact occurrence.
 *     const image = browser.element.findByAltText(
 *       'A group of people sitting in front of a computer.',
 *       { exact: true }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findByAltText
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findByAltText(text, [options])
 * @param {string} text
 * @param {{exact: boolean}} [options]
 * @returns {Array.<ScopedWebElement>}
 */
module.exports.command = function (text, {exact = true, ...options} = {}) {
  const comparingModifier = exact ? '' : '*';

  return this.find({
    ...options,
    selector: By.css(`[alt${comparingModifier}="${text}"]`)
  });
};
