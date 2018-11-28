/**
 * Checks if the content of the title element is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.title().to.contain('value');
 *   browser.expect.title().to.match('value');
 * }
 *
 * @method value
 * @display .a(type)
 * @alias an
 * @since v1.0
 * @api expect
 */
const chai = require('chai-nightwatch');
const flag = chai.flag;
const BaseAssertion = require('./_baseAssertion.js');

class TitleValueAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('titleValueFlag', true);
    this.message = 'Expected page title to' + (this.negate ? ' not' : '');
    this.start();
  }

  executeCommand() {
    return Promise.resolve({
      value: this.emitter.resultValue
    });
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

  retryCommand() {
    this.promise = this.emitter.createRetryPromise();
    this.emitter.executeProtocolAction();
  }
}



module.exports = TitleValueAssertion;
