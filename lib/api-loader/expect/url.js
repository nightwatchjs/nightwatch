const chai = require('chai-nightwatch');
const ExpectLoader = require('./_expect-loader.js');
const Logger = require('../../util/logger.js');
const UrlExpectAssert = require('../../api/expect/url.js');
const ExpectAssertionLoader = require('../expect-assertion.js');

class ExpectUrlLoader extends ExpectLoader {
  static get commandName() {
    return 'url';
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
      .executeProtocolAction('getCurrentUrl', args)
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
    return function commandFn({args, stackTrace}) {
      this.stackTrace = stackTrace;
      this.createEmmitter(...args);
      this.executeProtocolAction(args);

      this.promise.catch(err => {
        if (!(this.instance instanceof chai.Assertion)) {
          this.emit('error', new Error('An error occurred while running .expect.url()'));
        }
      });

      return this.instance;
    };
  }

  createExpectAssertion(args) {
    const assertionLoader = new ExpectAssertionLoader(this.nightwatchInstance);
    assertionLoader.commandName = 'url';
    assertionLoader.module = UrlExpectAssert;
    assertionLoader.createAssertion(this.instance, args);
  }

  static define(nightwatchInstance, parent = null) {
    const namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(ExpectUrlLoader.commandName, namespace, function commandFn(...args) {
      const stackTrace = ExpectLoader.getOriginalStackTrace(commandFn);

      const expectInstance = new ExpectUrlLoader(nightwatchInstance, args);
      const fn = expectInstance.createWrapper();

      nightwatchInstance.session.commandQueue
        .add({
          commandName: ExpectUrlLoader.commandName,
          commandFn: fn,
          context: expectInstance,
          args,
          stackTrace
        });


      return expectInstance.instance;
    });
  }
}

module.exports = ExpectUrlLoader;
