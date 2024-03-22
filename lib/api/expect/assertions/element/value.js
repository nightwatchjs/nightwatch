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
const BaseAssertion = require('./_element-assertion.js');

class ValueAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('valueFlag', true);

    this.message = 'Expected element %s to have value' + (this.negate ? ' not' : '');
    this.start();
  }

  executeCommand() {
    return this.executeProtocolAction('getElementProperty', ['value']);
  }

  onExecuteCommandResult(result) {
    this.resultValue = this.getResultValue(result);
    this.resultStatus = this.getResultStatus(result);
    this.resultErrorStatus = this.getResultError(result);

    if (this.resultValue === null && !this.resultErrorStatus) {
      this.valueNotFound();

      return;
    }

    this.processFlags();
    this.onResultSuccess();

    if (!this.passed && this.shouldRetry()) {
      this.scheduleRetry();
    } else {
      this.done();
    }
  }

  onResultSuccess() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    this.addExpectedInMessagePart();
  }

  valueNotFound() {
    this.processFlags();
    this.passed = this.hasCondition() ? false : this.negate;

    if (!this.passed && this.shouldRetry()) {
      this.scheduleRetry();
    } else {
      this.addExpectedInMessagePart();
      if (!this.hasCondition()) {
        this.expected = this.negate ? 'not found' : 'found';
        this.actual = this.getActual('not found');
      }

      if (!this.negate) {
        this.messageParts.push(' - value attribute was not found');
      }
      this.done();
    }
  }

  onResultFailed() {
    this.passed = false;
  }
}

module.exports = ValueAssertion;
