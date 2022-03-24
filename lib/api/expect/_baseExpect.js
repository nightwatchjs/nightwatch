const EventEmitter = require('events');
const chaiNightwatch = require('chai-nightwatch');
const {Logger, format, createPromise} = require('../../utils');

const BaseAssertion = require('./assertions/_baseAssertion.js');

class ValueExpectAssertion extends BaseAssertion {
  getMessage(negate) {
    if (this.emitter.getMessage) {
      return this.emitter.getMessage(negate);
    }

    const initialMessage = this.message || `Expected ${this.expectCommandName}`;

    return `${initialMessage} to ${negate ? ' not' : ''}%s`;
  }

  init() {
    super.init();

    this.flag('valueFlag', true);
    this.message = this.getMessage(this.negate);
    this.start();
  }

  executeCommand() {
    return Promise.resolve({
      value: this.emitter.resultValue
    });
  }

  onResultSuccess() {
    if (this.retries > 0 && this.negate) {
      return;
    }

    this.addExpectedInMessagePart();
  }

  onResultFailed() {
    this.passed = false;
  }

  formatMessage() {
    if (this.element) {
      let {selector, name} = this.element;
      let nameStr = '';

      if (name) {
        nameStr = `@${name} `;
      }

      selector = selector ? `${nameStr}<${selector}>` : `<${this.element.toString()}>`;

      this.message = format(this.message, selector, this.elapsedTime);
    }

    super.formatMessage();
  }

}

class ExpectInstance extends EventEmitter {

  flag(...args) {
    return chaiNightwatch.flag(this.instance, ...args);
  }

  get client() {
    return this.__nightwatchInstance;
  }

  get commandFileName() {
    return this.__commandName;
  }

  get commandArgs() {
    return this.__commandArgs;
  }

  get transport() {
    return this.client.transport;
  }

  get transportActions() {
    return this.client.transportActions;
  }

  get elementLocator() {
    return this.client.elementLocator;
  }

  get instance() {
    return this.__instance;
  }

  get stackTrace() {
    return this.__stackTrace;
  }

  set stackTrace(val) {
    this.__stackTrace = val;
  }

  toString() {
    return `${this.constructor.name} [name=expect.${this.commandFileName}]`;
  }

  constructor({commandName, nightwatchInstance, commandArgs}) {
    super();

    this.__commandName = commandName;
    this.__commandArgs = commandArgs;
    this.__nightwatchInstance = nightwatchInstance;

    this.startTime = null;
    this.resolve = null;
    this.reject = null;

    this.createInstance();

    if (!this.hasAssertions) {
      this.initAssertion();
    }
  }

  /**
   * Main entry point
   *
   * @param args
   */
  run(...args) {
    this.startTime = new Date().getTime();

    const promise = this.command(...args);
    this.handleCommandPromise(promise);
  }

  createLocalPromise() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  createInstance() {
    this.promise = this.createLocalPromise();

    this.deferred = {
      commandName: this.commandFileName
    };

    this.__instance = chaiNightwatch.expect((resolve, reject) => {
      this.deferred.resolve = resolve;
      this.deferred.reject = reject;
    });

    this.flag('deferred', this.deferred);

    if (!this.hasAssertions) {
      this.flag('valueFlag', true);
    }
    this.flag('emitter', this);
    this.flag('api', this.client.api);
    this.flag('promise', this.promise);
  }

  createRetryPromise() {
    this.promise = this.createLocalPromise();
    this.flag('promise', this.promise);

    return this.promise;
  }

  retryCommand() {
    const promise = this.command(...this.commandArgs);
    this.handleCommandPromise(promise);
  }

  /**
   * @override
   * @param [args]
   * @return {Promise}
   */
  command(...args) {
    throw new Error(`The expect command "${this.commandFileName}" should have a ".command()" method defined.`);
  }

  /**
   * @param {Promise} promise
   */
  handleCommandPromise(promise) {
    promise
      .then(result => {
        this.resultValue = result && result.value || result;

        return this.resolve(this.resultValue);
      })
      .catch(result => {
        if ((result instanceof Error) && result.name !== 'NoSuchElementError') {
          Logger.error(result);
        }
        this.reject(result);
      });
  }

  checkFlags() {
    if (!this.needsFlags) {
      return true;
    }

    if (this.flag('component')) {
      return true;
    }

    return this.needsFlags.some((flag) => this.flag(`${flag}Flag`) !== undefined || this.flag(flag) !== undefined);
  }

  initAssertion({AssertModule = ValueExpectAssertion, message = null, args = []} = {}) {
    const nightwatchInstance = this.client;
    const assertion = new AssertModule({
      nightwatchInstance,
      chaiExpect: this.instance,
      message,
      expectCommandName: this.commandFileName
    });
    assertion.init(...args);

    this.instance.assertion = assertion;
  }
}

module.exports = ExpectInstance;
