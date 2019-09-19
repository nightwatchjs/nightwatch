const chai = require('chai-nightwatch');
const flag = chai.flag;
const BaseCommandLoader = require('../_base-loader.js');

class ExpectLoader extends BaseCommandLoader {
  static get hasAssertions() {
    return true;
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.startTime = null;
    this.resolve = null;
    this.reject = null;

    this.createWrapper();
    this.createInstance();
  }

  createPromise() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  createInstance() {
    this.promise = this.createPromise();
    this.__instance = chai.expect(this.promise);

    flag(this.instance, 'promise', this.promise);
  }

  createRetryPromise() {
    this.promise = this.createPromise();
    flag(this.instance, 'promise', this.promise);

    return this.promise;
  }

  createEmmitter() {
    this.startTime = new Date().getTime();
    flag(this.instance, 'emitter', this);

    return this;
  }

  executeProtocolAction(protocolAction, elementId, args) {
    args = args || [];

    if (!Array.isArray(args)) {
      args = [args];
    }

    args.unshift(elementId);

    return this.transport.executeProtocolAction(protocolAction, args);
  }

  isResultSuccess(result) {
    return this.transport.isResultSuccess(result);
  }

  static createCommandWrapper(commandWrapper, expectInstance, promiseRejectedMsg = 'Element was not found.') {
    return function commandFn({args, stackTrace}) {
      this.stackTrace = stackTrace;
      commandWrapper.call(expectInstance, args);

      this.promise.catch(err => {
        if (!(this.instance instanceof chai.Assertion)) {
          this.emit('error', new Error(promiseRejectedMsg));
        }
      });

      return this.instance;
    };
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
}

module.exports = ExpectLoader;
