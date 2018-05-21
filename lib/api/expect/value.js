/**
 * Property that retrieves the value (i.e. the value attributed) of an element. Can be chained to check if contains/equals/matches the specified text or regex.
 *
 * ```
 * this.demoTest = function (browser) {
 *   browser.expect.element('#q').to.have.value.that.equals('search');
 *   browser.expect.element('#q').to.have.value.not.equals('search');
 *   browser.expect.element('#q').to.have.value.which.contains('search');
 *   browser.expect.element('#q').to.have.value.which.matches(/search/);
 * };
 * ```
 *
 * @display .value
 * @method value
 * @api expect
 */
const BaseAssertion = require('./_baseAssertion.js');

class ValueAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('valueFlag', true);

    this.message = 'Expected element <%s> to have value' + (this.negate ? ' not' : '');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getElementAttribute', ['value']);
  }

  elementFound() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    if (this.passed && this.waitForMs) {
      let message = '';
      if (this.hasCondition()) {
        message = 'condition was met';
      }
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - ' + message + ' in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
  }
}

module.exports = ValueAssertion;
