/**
 * Checks if the content of the page title is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.title().to.contain('value');
 *   browser.expect.title().to.match(/value/);
 * }
 *
 * @method title
 * @display .title()
 * @since v1.1
 * @api expect
 */
const BaseExpect = require('./_baseExpect.js');

class ExpectTitle extends BaseExpect {
  get needsFlags() {
    return [
      'contains',
      'startsWith',
      'endsWith',
      'matches',
      'equal'
    ];
  }

  get assertionType() {
    return 'property';
  }

  get hasAssertions() {
    return false;
  }

  getMessage(negate) {
    return `Expected page title to${negate ? ' not' : ''}`;
  }

  command() {
    return this.transportActions.getPageTitle();
  }
}

module.exports = ExpectTitle;
