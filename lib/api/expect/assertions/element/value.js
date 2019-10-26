/**
 * Property that retrieves the value (i.e. the value attributed) of an element. Can be chained to check if contains/equals/matches the specified text or regex.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#q').to.have.value.that.equals('search');
 *   browser.expect.element('#q').to.have.value.not.equals('search');
 *   browser.expect.element('#q').to.have.value.which.contains('search');
 *   browser.expect.element('#q').to.have.value.which.matches(/search/);
 * };
 *
 *
 * @display .value
 * @method value
 * @api expect.element
 */
const BaseAssertion = require('./_element.js');

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

  onResultSuccess() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    if (this.passed && this.waitForMs) {
      this.addTimeMessagePart();
    }
  }

  onResultFailed() {
    this.passed = false;
  }
}

module.exports = ValueAssertion;
