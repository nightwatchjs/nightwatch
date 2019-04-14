/**
 * Checks if the content of the title element is of an expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.expect.cookie('cookie-name').to.contain('cookie-value');
 *   browser.expect.cookie('cookie-name').to.match(/regex/);
 *   browser.expect.cookie('loginCookie', 'example.org').to.contain('cookie-value');
 * }
 *
 * @method cookie
 * @display .expect.cookie()
 * @param {string} name The name of the cookie to be inspected
 * @param {string} domain The domain name for which the cookie is set.
 * @since v1.1
 * @api expect
 */
const BaseAssertion = require('./_baseAssertion.js');

class CookieValueAssertion extends BaseAssertion {
  static get assertionType() {
    return BaseAssertion.AssertionType.PROPERTY;
  }

  init() {
    super.init();

    this.flag('cookieValueFlag', true);

    this.start();
  }

  executeCommand() {
    this.formatMessage();

    return Promise.resolve({
      value: this.emitter.cookieObject.value
    });
  }

  formatMessage() {
    let {cookieName = '', cookieDomain} = this.emitter;
    cookieName = `"${cookieName}"`;

    if (cookieDomain) {
      cookieName += ` with domain "${cookieDomain}"`;
    }
    this.message = `Expected cookie ${cookieName} to`;
    if (this.messageParts.length > 0) {
      this.message += this.messageParts.join('');
    }
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

  onPromiseRejected(response) {
    this.processFlags();
    this.setFlags();

    if (this.shouldRetry() && !this.negate) {
      this.scheduleRetry();

      return;
    }

    if (response.message) {
      this.messageParts.push(` - ${response.message}`);
    }

    this.elementNotFound();
    this.done();
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
