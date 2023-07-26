const {By} = require('selenium-webdriver');
const {roles, roleElements} = require('aria-query');

/**
 * Search for elements on the page that meet the provided ARIA role.
 * Elements can be searched by using another element as the starting point.
 *
 * You can pass some options to narrow the search:
 * - `selected` - picks elements that has the `area-selected` attribute with `true` or `false` value.
 * - `checked` - picks elements that has the `area-checked` attribute with `true` or `false` value.
 * - `pressed` - picks elements that has the `area-pressed` attribute with `true` or `false` value.
 * - `current` - picks elements that has the `area-current` attribute with `true` or `false` value.
 * - `level` - picks elements that has the `area-level` attribute with `true` or `false` value. This option is suitable only for the `heading` role.
 * - `expanded` - picks elements that has the `area-expanded` attribute with `true` or `false` value.
 *
 * @example
 * export default {
 *   demoTest(browser: NightwatchAPI): void {
 *     const comboboxes = browser.element.findAllByRole('combobox');
 *
 *     const headings = browser.element.findAllByRole(
 *       'heading',
 *       { level: 2 }
 *     );
 *   }
 * }
 *
 * @since 3.0.0
 * @method findAllByRole
 * @memberof ScopedWebElement
 * @instance
 * @syntax browser.element.findAllByRole(role, [options])
 * @param {string} role
 * @param {{selected: boolean, checked: boolean, pressed: boolean, current: boolean, level: number, expanded: boolean}} [options]
 * @returns {Array.<ScopeWebElement>}
 */
module.exports.command = function(role, {selected, checked, pressed, current, level, expanded, ...options} = {}) {
  const roleInformation = roles.get(role);

  if (!roleInformation) {
    throw new Error(`The specified role "${role}" is unknown.`);
  }

  if (selected !== undefined) {
    // guard against unknown roles
    if (roleInformation.props['aria-selected'] === undefined) {
      throw new Error(`"aria-selected" is not supported on role "${role}".`);
    }
  }

  if (checked !== undefined) {
    // guard against unknown roles
    if (roleInformation.props['aria-checked'] === undefined) {
      throw new Error(`"aria-checked" is not supported on role "${role}".`);
    }
  }

  if (pressed !== undefined) {
    // guard against unknown roles
    if (roleInformation.props['aria-pressed'] === undefined) {
      throw new Error(`"aria-pressed" is not supported on role "${role}".`);
    }
  }

  if (current !== undefined) {
    // guard against unknown roles
    // All currently released ARIA versions support `aria-current` on all roles.
    // Leaving this for symmetry and forward compatibility
    if (roleInformation.props['aria-current'] === undefined) {
      throw new Error(`"aria-current" is not supported on role "${role}".`);
    }
  }

  if (level !== undefined) {
    // guard against using `level` option with any role other than `heading`
    if (role !== 'heading') {
      throw new Error(`Role "${role}" cannot have "level" property.`);
    }
  }

  if (expanded !== undefined) {
    // guard against unknown roles
    if (roleInformation.props['aria-expanded'] === undefined) {
      throw new Error(`"aria-expanded" is not supported on role "${role}".`);
    }
  }

  const explicitRoleSelector = `*[role~="${role}"]`;
  const roleRelations = roleElements.get(role) || new Set();
  const implicitRoleSelectors = new Set(Array.from(roleRelations).map(({name}) => name));
  const selector = By.css([explicitRoleSelector].concat(Array.from(implicitRoleSelectors)).join(','));

  return this.createScopedElements({selector, ...options}, {parentElement: this, commandName: 'findAllByRole'});
};
