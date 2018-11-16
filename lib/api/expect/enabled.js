/**
 * Property that checks if an element is currently enabled.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#weblogin').to.be.enabled;
 *   browser.expect.element('#main').to.not.be.enabled;
 *   browser.expect.element('#main').to.be.enabled.before(100);
 * };
 *
 *
 * @method enabled
 * @display .enabled
 * @since v0.7
 * @api expect
 */
const BaseAssertion = require('./_baseAssertion.js');

class EnabledAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.message = 'Expected element <%s> to ' + (this.negate ? 'not be enabled' : 'be enabled');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('isElementEnabled');
  }

  elementFound() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    this.passed = this.negate ? !this.resultValue : this.resultValue;
    this.expected = this.negate ? 'not enabled' : 'enabled';
    this.actual = this.resultValue ? 'enabled' : 'not enabled';

    if (this.passed && this.waitForMs) {
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = false;
    this.expected = this.negate ? 'not enabled' : 'enabled';
    this.actual = 'not found';
  }
}


module.exports = EnabledAssertion;
