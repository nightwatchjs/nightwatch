const chai = require('chai-nightwatch');
const flag = chai.flag;
const ExpectLoader = require('./_expect-loader.js');
const Logger = require('../../util/logger.js');
const CookieExpectAssert = require('../../api/expect/cookie.js');
const ExpectAssertionLoader = require('../expect-assertion.js');

class ExpectCookieLoader extends ExpectLoader {
  static get commandName() {
    return 'cookie';
  }

  static get hasAssertions() {
    return false;
  }

  get args() {
    return this.__args;
  }

  constructor(nightwatchInstance, args) {
    super(nightwatchInstance);

    this.__args = [];
    this.createExpectAssertion(args);
  }

  executeProtocolAction() {

    const cookieName = this.args[0] || '';
    const cookieDomain = this.args[1] || '';

    this.transport
      .executeProtocolAction('getCookieString', this.args)
      .then(result => {
        if (result && result.value && result.value.length > 0) {

          let matchingCookies = result.value.filter(function(cookie) {

            if (cookieDomain !== '') {
              return (cookie.name || '') === cookieName && (cookie.domain || '') === cookieDomain;
            }

            return (cookie.name || '') === cookieName;
          });

          if (matchingCookies.length === 1) {
            this.resultValue = matchingCookies[0].value || '';
          }

          if (matchingCookies.length > 1) {
            throw(`multiple cookies with the name '${cookieName}' and domain '${cookieDomain}'`);
          }

          if (matchingCookies.length === 0) {
            throw(`there is no cookie with the name '${cookieName}' and domain '${cookieDomain}'`);
          }

          return this.resolve(result.value);
        }

        throw result;
      })
      .catch(result => {
        if (result instanceof Error) {
          Logger.error(result);
        }
        this.reject(result);
      });

    return this.instance;
  }

  createWrapper() {
    return function commandFn(...args) {
      this.stackTrace = commandFn.stackTrace;
      this.__args = args;
      this.createEmmitter(...args);
      this.executeProtocolAction();

      this.promise.catch(err => {
        if (!(this.instance instanceof chai.Assertion)) {
          this.emit('error', new Error('An error occurred while running .expect.cookie()'));
        }
      });

      return this.instance;
    };
  }

  createExpectAssertion(args) {
    const assertionLoader = new ExpectAssertionLoader(this.nightwatchInstance);
    assertionLoader.commandName = 'cookie';
    assertionLoader.module = CookieExpectAssert;
    assertionLoader.createAssertion(this.instance, args);
  }

  static define(nightwatchInstance, parent = null) {
    const namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(ExpectCookieLoader.commandName, namespace, function commandFn(...args) {
      const originalStackTrace = ExpectLoader.getOriginalStrackTrace(commandFn);

      const expectInstance = new ExpectCookieLoader(nightwatchInstance, args);
      const fn = expectInstance.createWrapper();

      nightwatchInstance.session.commandQueue
        .add(ExpectCookieLoader.commandName, fn, expectInstance, args, originalStackTrace);

      return expectInstance.instance;
    });
  }
}

module.exports = ExpectCookieLoader;