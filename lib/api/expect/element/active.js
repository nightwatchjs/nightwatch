/**
 * Property that checks if an element is active in the DOM.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#main').to.be.active;
 *   browser.expect.element('#main').to.not.be.active;
 *   browser.expect.element('#main').to.be.active.before(100);
 * };
 *
 *
 * @method active
 * @display .active
 * @since v1.1
 * @api expect.element
 */
const BaseAssertion = require('../_baseAssertion.js');

class ActiveAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('active', true);
    this.message = 'Expected element <%s> to ' + (this.negate ? 'not be active' : 'be active');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getActiveElement');
  }

  compareElementIds() {
    const activeElementId = this.client.transport.getElementId(this.resultValue);

    return activeElementId === this.elementId;
  }

  elementFound() {
    const result = this.compareElementIds();

    this.passed = this.negate ? result === false : result;
    this.expected = this.negate ? 'not active' : 'active';
    this.actual = result ? 'active' : 'not active';

    if (this.passed && this.waitForMs) {
      this.elapsedTime = this.getElapsedTime();
      this.messageParts.push(' - condition was met in ' + this.elapsedTime + 'ms');
    }
  }

  elementNotFound() {
    this.passed = this.negate;

    if (!this.passed && this.shouldRetry()) {
      return;
    }

    if (this.waitForMs && this.negate) {
      this.messageParts.push(this.checkWaitForMsg(this.elapsedTime) + '.');
    }
  }

}

module.exports = ActiveAssertion;
