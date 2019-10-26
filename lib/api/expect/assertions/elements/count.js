/**
 * Checks if the number of elements specified by a selector is equal or not to a given value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.elements('div').count.to.equal(10);
 *   browser.expect.elements('p').count.to.not.equal(1);
 * }
 *
 * @method count
 * @display .elements(<element>).count
 * @since v1.1
 * @api expect.elements
 */
const BaseAssertion = require('../_baseAssertion.js');

class CountAssertion extends BaseAssertion {
  static get assertionName() {
    return ['count'];
  }

  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('valueFlag', true);
    this.message = 'Expected elements <%s> count to' + (this.negate ? ' not' : '');
    this.start();
  }

  executeCommand() {
    return Promise.resolve({
      value: this.emitter.resultValue.length
    });
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

module.exports = CountAssertion;
