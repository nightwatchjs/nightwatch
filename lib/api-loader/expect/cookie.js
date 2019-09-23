const chai = require('chai-nightwatch');
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
    this.cookieName = this.args[0] || '';
    this.cookieDomain = this.args[1] || '';

    this.transport
      .executeProtocolAction('getCookieString', this.args)
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

    return this.instance;
  }

  createWrapper() {
    return function commandFn({args, stackTrace}) {
      this.stackTrace = stackTrace;
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

  static defineExpect(nightwatchInstance, parent = null, opts) {
    const namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(opts.commandName, namespace, function commandFn(...args) {
      const expectInstance = opts.createInstance();
      const stackTrace = ExpectLoader.getOriginalStackTrace(commandFn);
      const fn = ExpectLoader.createCommandWrapper(opts.commandFn, expectInstance);

      nightwatchInstance.session.commandQueue
        .add({
          commandName: opts.commandName,
          commandFn: fn,
          context: expectInstance,
          args,
          stackTrace
        });

      return expectInstance.instance;
    });
  }

  static define(nightwatchInstance, parent = null) {
    const namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(ExpectCookieLoader.commandName, namespace, function commandFn(...args) {
      const stackTrace = ExpectLoader.getOriginalStackTrace(commandFn);

      const expectInstance = new ExpectCookieLoader(nightwatchInstance, args);
      const fn = expectInstance.createWrapper();

      nightwatchInstance.session.commandQueue
        .add({
          commandName: ExpectCookieLoader.commandName,
          commandFn: fn,
          context: expectInstance,
          args,
          stackTrace
        });

      return expectInstance.instance;
    });
  }
}

module.exports = ExpectCookieLoader;
