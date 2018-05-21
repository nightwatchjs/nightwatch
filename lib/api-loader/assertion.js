const util = require('util');
const EventEmitter = require('events');
const isObject = require('../util/utils.js').isObject;
const NightwatchAssertion = require('../core/assertion.js');
const BaseCommandLoader = require('./_base-loader.js');

class AssertionLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.type = 'assertion';
    this.assertion = null;
    this.retries = 0;
    this.startTime = new Date().getTime();
    this.globals = this.api.globals || {};
    this.timeout = this.globals.retryAssertionTimeout || 0; //ms
    this.rescheduleInterval = this.globals.waitForConditionPollInterval || 500; //ms
    this.shouldRetry = this.timeout > 0;
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

  validateModuleDefinition() {
    if (!(isObject(this.module) && this.module.assertion)) {
      throw new Error('The assertion module needs to contain an .assertion() method');
    }
  }

  createInstance(AssertionModule, moduleArgs) {
    const nightwatchInstance = this.nightwatchInstance;

    util.inherits(AssertionModule, EventEmitter);

    class AssertionInstance extends AssertionModule {

      constructor() {
        super(...moduleArgs);

        EventEmitter.call(this);
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

      complete(...args) {
        args.unshift('complete');

        setImmediate(() => {
          this.emit.apply(this, args);
        });
      }
    }

    this.__instance = new AssertionInstance();
  }

  executeCommand() {
    Object.keys(AssertionLoader.interfaceMethods).forEach(method => {
      let type = AssertionLoader.interfaceMethods[method];
      if (!this.isTypeImplemented(method, type)) {
        throw new Error(`Assertion class must implement method/property ${method}`);
      }
    });

    return this.scheduleAssertion();
  }

  runAssertion(passed, value, calleeFn, message) {
    let expected = typeof this.instance.expected == 'function' ? this.instance.expected() : this.instance.expected;

    this.assertion = NightwatchAssertion.create(passed, {expected, actual: value}, calleeFn, message, this.abortOnFailure, this.stackTrace);

    return this.assertion.run(this.reporter, this);
  }

  scheduleAssertion() {
    this.instance.command(function commandCallback(result) {
      let passed;
      let value;
      let timeSpent = new Date().getTime() - this.startTime;

      if (typeof this.instance.failure == 'function' && this.instance.failure.call(this.instance, result)) {
        passed = false;
        value = null;
      } else {
        value = this.instance.value.call(this.instance, result);
        passed = this.instance.pass.call(this.instance, value);
      }

      if (!passed && timeSpent < this.timeout) {
        return this.reschedule();
      }

      let message = this.getFullMessage(passed, timeSpent);
      this.runAssertion(passed, value, commandCallback, message);
    }.bind(this));

    return this;
  }

  getFullMessage(passed, timeSpent) {
    if (!this.shouldRetry) {
      return this.instance.message;
    }

    let timeLogged = passed ? timeSpent : this.timeout;

    if (this.instance.message.endsWith('.')) {
      this.instance.message = this.instance.message.substr(0, this.instance.message.length - 1);
    }

    return `${this.instance.message} after ${timeLogged} milliseconds.`;
  }

  reschedule() {
    setTimeout(() => {
      this.retries++;
      this.scheduleAssertion();
    }, this.rescheduleInterval);

    return this;
  }

  createWrapper(abortOnFailure) {
    this.validateModuleDefinition();

    let moduleDefinition = this.module.assertion;
    this.abortOnFailure = abortOnFailure;
    let assertion = this;

    this.commandFn = function commandFn(...args) {
      assertion.stackTrace = commandFn.stackTrace;
      assertion.createInstance(moduleDefinition, args);

      return assertion.executeCommand();
    };

    return this;
  }
}

module.exports = AssertionLoader;