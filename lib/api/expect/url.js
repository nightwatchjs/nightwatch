/**
 * Checks if the page url is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.url().to.contain('https://');
 *   browser.expect.url().to.endWith('.org');
 * }
 *
 * @method url
 * @display .url()
 * @since v1.1
 * @api expect
 */
const BaseExpect = require('./_baseExpect.js');

class ExpectUrl extends BaseExpect {
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
    return 'method';
  }

  get hasAssertions() {
    return false;
  }

  getMessage(negate) {
    return `Expected current url to${negate ? ' not' : ''}`;
  }

  command() {
    return this.transportActions.getCurrentUrl();
  }
}

module.exports = ExpectUrl;
