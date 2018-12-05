/**
 * Checks if the type (i.e. tag name) of a specified element is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.element('#q').to.be.an('input');
 *   browser.expect.element('#q').to.be.an('input', 'Testing if #q is an input');
 *   browser.expect.element('#w').to.be.a('span');
 * }
 *
 * @method a
 * @display .a(type)
 * @alias an
 * @since v0.7
 * @param {string} type The expected type
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api expect
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

    this.flag('elementsCountFlag', true);
    this.message = 'Expected elements <%s> count to' + (this.negate ? ' not' : '');
    this.start();
  }

  executeCommand() {
    return Promise.resolve({
      value: this.emitter.resultValue.length
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
    this.emitter.locateMultipleElements();
  }
}

module.exports = CountAssertion;
