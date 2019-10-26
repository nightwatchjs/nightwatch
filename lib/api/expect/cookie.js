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
    return [
      'contains',
      'startsWith',
      'endsWith',
      'matches',
      'equal'
    ];
  }

  get hasAssertions() {
    return false;
  }

  getMessage(negate) {
    let {cookieName = '', cookieDomain} = this;
    cookieName = `"${cookieName}"`;

    if (cookieDomain) {
      cookieName += ` with domain "${cookieDomain}"`;
    }

    return `Expected cookie ${cookieName} to${negate ? ' not' : ''}`;
  }

  command(...args) {
    this.cookieName = args[0] || '';
    this.cookieDomain = args[1] || '';

    return this.transportActions.getCookieString();
  }

  handleCommandPromise(promise) {
    promise
      .then(result => {
        let cookieObject = null;

        if (result && result.value && result.value.length > 0) {
          const matchingCookies = result.value.filter(({name = '', domain = ''}) => {
            if (this.cookieName !== '' && this.cookieDomain !== '') {
              return name === this.cookieName && domain === this.cookieDomain;
            }

            return name === this.cookieName;
          });

          if (matchingCookies.length === 1) {
            cookieObject = matchingCookies[0];
          }

          const domainStr = this.cookieDomain ? ` and domain "${this.cookieDomain}"` : '';
          if (matchingCookies.length > 1) {
            return this.reject({
              message: `Multiple cookies with the name "${this.cookieName}"${domainStr} were found.`
            });
          }

          if (matchingCookies.length === 0) {
            return this.reject({
              message: `A cookie with the name "${this.cookieName}"${domainStr} was not found.`
            });
          }

          this.cookieObject = cookieObject || {};

          return this.resolve(this.cookieObject);
        }

        throw result;
      })
      .catch(result => {
        if (result instanceof Error) {
          Logger.error(result);
        }
        this.reject(result);
      });
  }
}

module.exports = ExpectCookie;
