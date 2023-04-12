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
const BaseExpect = require('./_baseExpect.js');

class ExpectCookie extends BaseExpect {
  get needsFlags() {
    return ['contains', 'startsWith', 'endsWith', 'matches', 'equal'];
  }

  get hasAssertions() {
    return false;
  }

  getMessage(negate) {
    this.cookieName = this.commandArgs[0] || '';
    this.cookieDomain = this.commandArgs[1] || '';

    let {cookieName = '', cookieDomain} = this;
    cookieName = `"${cookieName}"`;

    if (cookieDomain) {
      cookieName += ` for domain "${cookieDomain}"`;
    }

    return `Expected cookie ${cookieName} to${negate ? ' not' : ''}`;
  }

  command(...args) {
    return this.transportActions.getCookie(...args);
  }

  handleCommandPromise(promise) {
    promise
      .then((result) => {
        const domainStr = this.cookieDomain ? ` for domain "${this.cookieDomain}"` : '';
        if (!result.value) {
          return this.reject(new NotFoundError(`no cookie "${this.cookieName}"${domainStr} was found`));
        }

        if (result && result.value) {
          if (Array.isArray(result.value)) {
            this.resultValue = result.value.length > 0 ? result.value[0].value : null;
          } else {
            // result.value represents the cookie object, so result.value.value would be the cookie value
            this.resultValue = result.value.value;
          }
        } else {
          this.resultValue = {};
        }

        return this.resolve(this.resultValue);
      })
      .catch((result) => {
        this.reject(result);
      });
  }
}

class NotFoundError extends Error {
  constructor(props) {
    super(props);
    this.name = 'NotFoundError';
  }
}

module.exports = ExpectCookie;
