const chai = require('chai-nightwatch');
const flag = chai.flag;
const ExpectLoader = require('./_expect-loader.js');
const Logger = require('../../util/logger.js');
const TitleExpectAssert = require('../../api/expect/title/value.js');
const ExpectAssertionLoader = require('../expect-assertion.js');

class ExpectTitleLoader extends ExpectLoader {
  static get commandName() {
    return 'title';
  }

  static get hasAssertions() {
    return false;
  }

  constructor(nightwatchInstance, args) {
    super(nightwatchInstance);

    this.createExpectAssertion(args);
  }

  executeProtocolAction(args) {
    this.transport
      .executeProtocolAction('getPageTitle', args)
      .then(result => {
        if (result && result.value) {
          this.resultValue = result.value;

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
      this.createEmmitter(...args);
      this.executeProtocolAction(args);

      this.promise.catch(err => {
        if (!(this.instance instanceof chai.Assertion)) {
          this.emit('error', new Error('An error occurred while running .expect.title()'));
        }
      });

      return this.instance;
    };
  }

  createExpectAssertion(args) {
    const assertionLoader = new ExpectAssertionLoader(this.nightwatchInstance);
    assertionLoader.commandName = 'title';
    assertionLoader.module = TitleExpectAssert;
    assertionLoader.createAssertion(this.instance, args);
  }

  static define(nightwatchInstance, parent = null) {
    const namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(ExpectTitleLoader.commandName, namespace, function commandFn(...args) {
      const originalStackTrace = ExpectLoader.getOriginalStrackTrace(commandFn);

      const expectInstance = new ExpectTitleLoader(nightwatchInstance, args);
      const fn = expectInstance.createWrapper();

      nightwatchInstance.session.commandQueue
        .add(ExpectTitleLoader.commandName, fn, expectInstance, args, originalStackTrace);

      return expectInstance.instance;
    });
  }
}

module.exports = ExpectTitleLoader;