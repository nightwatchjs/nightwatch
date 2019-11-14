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
    this.start();
    this.message = `Expected elements <${this.element.selector}> count to${this.negate ? ' not' : ''}`;
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

    this.addExpectedInMessagePart();
  }

  onResultFailed() {
    this.passed = false;
  }
}

module.exports = CountAssertion;
