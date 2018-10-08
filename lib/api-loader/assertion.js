const util = require('util');
const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const NightwatchAssertion = require('../core/assertion.js');
const BaseCommandLoader = require('./_base-loader.js');

class AssertionLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.type = 'assertion';
    this.assertion = null;
    this.retries = 0;
    this.globals = this.api.globals || {};
    this.timeout = this.globals.retryAssertionTimeout || 0; //ms
    this.rescheduleInterval = this.globals.waitForConditionPollInterval || 500; //ms
    this.shouldRetry = this.timeout > 0;
    this.deferred = null;
  }

  set abortOnFailure(val) {
    this.__abortOnFailure = val;
  }

  get abortOnFailure() {
    return this.__abortOnFailure;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  static get interfaceMethods() {
    return {
      expected: '*',
      message: '*',
      pass: 'function',
      value: 'function',
      command: 'function'
    };
  }

  createPromise() {
    this.deferred = {};
    this.deferred.promise = new Promise((resolve, reject) => {
      this.deferred.resolve = resolve;
      this.deferred.reject = reject;
    });
  }

  validateModuleDefinition() {
    if (!(Utils.isObject(this.module) && this.module.assertion)) {
      throw new Error('The assertion module needs to contain an .assertion() method');
    }
  }

  createInstance(AssertionModule, moduleArgs) {
    const nightwatchInstance = this.nightwatchInstance;

    util.inherits(AssertionModule, EventEmitter);

    class AssertionInstance extends AssertionModule {

      constructor() {
        super(...moduleArgs);
        EventEmitter.prototype.constructor.call(this);
      }

      get api() {
        return nightwatchInstance.api;
      }

      /**
       * @deprecated
       */
      get client() {
        return nightwatchInstance.client;
      }
    }

    this.__instance = new AssertionInstance();

    Object.keys(AssertionLoader.interfaceMethods).forEach(method => {
      let type = AssertionLoader.interfaceMethods[method];
      if (!this.isTypeImplemented(method, type)) {
        throw new Error(`Assertion class must implement method/property ${method}`);
      }
    });

    this.updateTimers();

    return this;
  }

  updateTimers() {
    if (Utils.isNumber(this.instance.retryAssertionTimeout)) {
      this.timeout = this.instance.retryAssertionTimeout;
    }

    if (Utils.isNumber(this.instance.rescheduleInterval)) {
      this.rescheduleInterval = this.instance.rescheduleInterval;
    }
  }

  executeCommand(args) {
    this.startTime = new Date().getTime();

    this.updateElementSelector(args)
      .then(elementResult => {
        if (elementResult) {
          args[0] = elementResult;
        }

        return this.createInstance(this.module.assertion, args).scheduleAssertion();
      }).catch(err => this.deferred.reject(err));

    return this;
  }

  scheduleAssertion() {
    this.instance.command(function commandCallback(commandResult) {
      let passed;
      let value;
      let timeSpent = new Date().getTime() - this.startTime;

      if (Utils.isFunction(this.instance.failure) && this.instance.failure.call(this.instance, commandResult)) {
        passed = false;
        value = null;
      } else {
        value = this.instance.value.call(this.instance, commandResult);
        passed = this.instance.pass.call(this.instance, value);
      }

      if (!passed && timeSpent < this.timeout) {
        return this.reschedule();
      }

      let message = this.getFullMessage(passed, timeSpent);
      this.assertion = this.createAssertion(passed, value, commandCallback, message);

      this.runAssertion()
        .then(assertResult => {
          const isError = assertResult instanceof Error;

          if (isError) {
            this.deferred.reject(assertResult);
          } else {
            const promiseResult = Object.assign({}, commandResult);
            promiseResult.returned = 1;

            this.deferred.resolve(promiseResult);
          }
        });
    }.bind(this));
  }

  reschedule() {
    setTimeout(() => {
      this.retries++;
      this.scheduleAssertion();
    }, this.rescheduleInterval);

    return this;
  }

  createAssertion(passed, value, calleeFn, message) {
    const expected = Utils.isFunction(this.instance.expected) ? this.instance.expected() : this.instance.expected;

    return NightwatchAssertion.create(passed, {expected, actual: value}, calleeFn, message, this.abortOnFailure, this.stackTrace);
  }

  runAssertion() {
    const callback = Utils.isFunction(this.instance.callback) ? this.instance.callback : function() {};

    return this.assertion.run(this.reporter)
      .then(result => {
        callback.call(this.instance, result);

        return result;
      });
  }

  getFullMessage(passed, timeSpent) {
    if (!this.shouldRetry) {
      return this.instance.message;
    }

    let timeLogged = passed ? timeSpent : this.timeout;

    if (this.instance.message.endsWith('.')) {
      this.instance.message = this.instance.message.substr(0, this.instance.message.length - 1);
    }

    return `${this.instance.message} ${(passed ? ' - ' : 'in ') + timeLogged} ms.`;
  }

  createWrapper(abortOnFailure) {
    if (this.module) {
      this.validateModuleDefinition();
      this.abortOnFailure = abortOnFailure;

      this.commandFn = function commandFn(...args) {

        this.stackTrace = commandFn.stackTrace;
        this.createPromise();
        this.executeCommand(args);

        return this.deferred.promise;
      };
    }

    return this;
  }
}

module.exports = AssertionLoader;