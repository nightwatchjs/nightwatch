/**
 * Property that asserts the visibility of a specified element.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.visible;
 *   browser.expect.element('#main').to.not.be.visible;
 *   browser.expect.element('#main').to.be.visible.before(100);
 * };
 *
 *
 * @display .visible
 * @method visible
 * @api expect.element
 */
const BaseAssertion = require('../_baseAssertion.js');

class VisibleAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.message = 'Expected element <%s> to ' + (this.negate ? 'not be visible' : 'be visible');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('isElementDisplayed');
  }

  elementFound() {
    this.passed = this.negate ? this.resultValue === false : this.resultValue;
    this.expected = this.negate ? 'not visible' : 'visible';
    this.actual = this.resultValue ? 'visible' : 'not visible';

    if (this.passed && this.waitForMs) {
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
    this.expected = this.negate ? 'not visible' : 'visible';
    this.actual = 'not found';
  }
}


module.exports = VisibleAssertion;
