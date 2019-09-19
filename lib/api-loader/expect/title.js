const chai = require('chai-nightwatch');
const ExpectLoader = require('./_expect-loader.js');
const Logger = require('../../util/logger.js');
const TitleExpectAssert = require('../../api/expect/title.js');
const ExpectAssertionLoader = require('../expect-assertion.js');

class ExpectTitleLoader extends ExpectLoader {
  static get commandName() {
    return 'title';
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
    this.transport
      .executeProtocolAction('getPageTitle', this.args)
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
      this.__args = args;
      this.createEmmitter(...args);
      this.executeProtocolAction();

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
      const stackTrace = ExpectLoader.getOriginalStackTrace(commandFn);

      const expectInstance = new ExpectTitleLoader(nightwatchInstance, args);
      const fn = expectInstance.createWrapper();

      nightwatchInstance.session.commandQueue
        .add({
          commandName: ExpectTitleLoader.commandName,
          commandFn: fn,
          context: expectInstance,
          args,
          stackTrace
        });

      return expectInstance.instance;
    });
  }
}

module.exports = ExpectTitleLoader;
