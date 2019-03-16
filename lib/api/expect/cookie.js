/**
 * Checks if the content of the title element is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.cookie('cookie-name').to.contain('cookie-value');
 *   browser.expect.cookie('cookie-name', 'cookie-domain').to.contain('cookie-value');
 *   browser.expect.cookie('cookie-name').to.match('value');
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

class CookieValueAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('cookieValueFlag', true);
    this.message = 'Expected cookie to' + (this.negate ? ' not' : '');
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
    this.promise.then(this.onPromiseResolved.bind(this), this.onPromiseRejected.bind(this));
    this.emitter.executeProtocolAction();
  }
}



module.exports = CookieValueAssertion;
