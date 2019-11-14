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
    this.cookieName = this.commandArgs[0] || '';
    this.cookieDomain = this.commandArgs[1] || '';

    let {cookieName = '', cookieDomain} = this;
    cookieName = `"${cookieName}"`;

    if (cookieDomain) {
      cookieName += ` for domain "${cookieDomain}"`;
    }

    return `Expected cookie ${cookieName} to${negate ? ' not' : ''}`;
  }

  command() {
    return this.transportActions.getCookieString();
  }

  handleCommandPromise(promise) {
    promise
      .then(result => {
        const domainStr = this.cookieDomain ? ` for domain "${this.cookieDomain}"` : '';
        let cookieObject = null;
        let matchingCookies = null;

        if (result && result.value && result.value.length > 0) {
          matchingCookies = result.value.filter(({name = '', domain = ''}) => {
            if (this.cookieName !== '' && this.cookieDomain !== '') {
              return name === this.cookieName && domain === this.cookieDomain;
            }

            return name === this.cookieName;
          });

          if (matchingCookies.length === 1) {
            cookieObject = matchingCookies[0];
          }

          if (matchingCookies.length > 1) {
            return this.reject(new NotFoundError(`multiple cookies with the name "${this.cookieName}"${domainStr} were found`));
          }
        }

        if (!matchingCookies || matchingCookies.length === 0) {
          return this.reject(new NotFoundError(`no cookie "${this.cookieName}"${domainStr} was found`));
        }

        this.resultValue = cookieObject ? cookieObject.value : {};

        return this.resolve(this.resultValue);
      })
      .catch(result => {
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
