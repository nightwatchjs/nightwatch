/**
 * Property that checks if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.selected;
 *   browser.expect.element('#main').to.not.be.selected;
 *   browser.expect.element('#main').to.be.selected.before(100);
 * };
 *
 *
 * @method selected
 * @display .selected
 * @since v0.7
 * @api expect
 */
const BaseAssertion = require('./_baseAssertion.js');

class SelectedAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.message = 'Expected element <%s> to ' + (this.negate ? 'not be selected' : 'be selected');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('isElementSelected');
  }

  elementFound() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    this.passed = this.negate ? !this.resultValue : this.resultValue;
    this.expected = this.negate ? 'not selected' : 'selected';
    this.actual = this.resultValue ? 'selected' : 'not selected';

    if (this.passed && this.waitForMs) {
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
    this.expected = this.negate ? 'not selected' : 'selected';
    this.actual = 'not found';
  }

}


module.exports = SelectedAssertion;
