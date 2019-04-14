/**
 * Checks if the page url is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.url().to.contain('https://');
 *   browser.expect.url().to.endWidth('.org');
 * }
 *
 * @method url
 * @display .url()
 * @since v1.1
 * @api expect
 */
const BaseAssertion = require('./_baseAssertion.js');

class UrlValueAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('urlValueFlag', true);
    this.message = 'Expected current url to' + (this.negate ? ' not' : '');
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
}

module.exports = UrlValueAssertion;
