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
const BaseAssertion = require('./_element-assertion.js');

class VisibleAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('visibleFlag', true);
    this.message = 'Expected element %s to ' + (this.negate ? 'not be visible' : 'be visible');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('isElementDisplayed');
  }

  onResultSuccess() {
    this.passed = this.negate ? this.resultValue === false : !!this.resultValue;
    this.expected = this.negate ? 'not visible' : 'visible';
    this.actual = this.getActual();

    this.addExpectedInMessagePart();
  }

  onResultFailed() {
    this.passed = false;
    this.expected = this.negate ? 'not visible' : 'visible';
    this.actual = 'not found';
  }

  getActual() {
    const value = this.resultValue === true ? 'visible' : 'not visible';

    return super.getActual(value);
  }
}


module.exports = VisibleAssertion;
