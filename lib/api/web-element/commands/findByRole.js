/**
 * Search for an element on the page that meets the provided ARIA role.
 * Element can be searched by using another element as the starting point.
 *
 * You can pass some options to narrow the search:
 * - `selected` - picks an element that has the `area-selected` attribute with `true` or `false` value.
 * - `checked` - picks an element that has the `area-checked` attribute with `true` or `false` value.
 * - `pressed` - picks an element that has the `area-pressed` attribute with `true` or `false` value.
 * - `current` - picks an element that has the `area-current` attribute with `true` or `false` value.
 * - `level` - picks an element that has the `area-level` attribute with `true` or `false` value. This option is suitable only for the `heading` role.
 * - `expanded` - picks an element that has the `area-expanded` attribute with `true` or `false` value.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const comboboxes = browser.element.findByRole('combobox');
 *
 *     const headings = browser.element.findByRole('heading', { level: 2 });
 *   }
 * }
 *
 * @since 3.0.0
 * @method findByRole
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findByRole(role, [options])
 * @param {string} role
 * @param {{selected: boolean, checked: boolean, pressed: boolean, current: boolean, level: number, expanded: boolean}} [options]
 * @returns {ScopedWebElement}
 */
module.exports.command = function(role, options) {
  // eslint-disable-next-line no-async-promise-executor
  return this.createScopedElement(new Promise(async (resolve, reject) => {
    try {
      const elements = await this.findAllByRole(role, options);
      const element = elements[0];

      if (!element) {
        throw new Error(`The element with "${role}" role is not found.`);
      }

      resolve(element);
    } catch (error) {
      reject(error);
    }
  }), this);
};
