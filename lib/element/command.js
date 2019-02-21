const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const LocateStrategy = require('../util/locatestrategy.js');
const Element = require('../element/element.js');

class ElementCommand extends EventEmitter{
  static isSelectorObject(obj) {
    return Utils.isObject(obj) && obj.selector;
  }

  static get ELEMENT_COMMAND_ARGS() {
    return 3;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get client() {
    return this.nightwatchInstance;
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get desiredCapabilities() {
    return this.nightwatchInstance.session.desiredCapabilities;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get commandName() {
    return this.__commandName;
  }

  get defaultUsing() {
    return this.nightwatchInstance.locateStrategy || LocateStrategy.getDefault();
  }

  get strategy() {
    return this.__strategy;
  }

  get elementLocator() {
    return this.nightwatchInstance.elementLocator;
  }

  get rescheduleInterval() {
    return this.__rescheduleIntervalMs;
  }

  get ms() {
    return this.__timeoutMs;
  }

  get needsRetry() {
    return this.__needsRetry;
  }

  get callback() {
    return this.__callback;
  }

  get element() {
    return this.__element;
  }

  get selector() {
    return this.__selector;
  }

  get extraArgsCount() {
    return null;
  }

  get currentPromise() {
    return this.deferred.promise;
  }

  constructor({nightwatchInstance, commandName, args}) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.__commandName = commandName;
    this.__needsRetry = true;

    this.retries = 0;
    this.setStrategy();

    this.abortOnFailure = this.api.globals.abortOnAssertionFailure;
    this.throwOnMultipleElementsReturned = this.api.globals.throwOnMultipleElementsReturned;
    this.elementId = null;
    this.args = args;

    this.setMilliseconds();
    this.setRescheduleInterval();
    this.setArguments();
    this.setOptionsFromSelector();
    this.createElement();
  }

  /**
   * @override
   * @returns {*}
   */
  protocolAction() {
    return Promise.resolve();
  }

  validateArgsCount() {
    ////////////////////////////////////////////////////////////////////////////
    // if there is an element command such as getText, getAttribute verify if the
    // expected number of args have been supplied
    ////////////////////////////////////////////////////////////////////////////
    if (this.args.length && !Utils.isFunction(this.args[this.args.length - 1])) {
      this.args.push(function() {});
    }

    if (this.extraArgsCount !== null) {
      const expectedArgs = ElementCommand.ELEMENT_COMMAND_ARGS + this.extraArgsCount;
      if (this.args.length < expectedArgs - 1 || this.args.length > expectedArgs) {
        throw new Error(`${this.commandName} method expects ${(expectedArgs - 1)} `+
          `(or ${expectedArgs} if using implicit "css selector" strategy) arguments - ${this.args.length} given.`);
      }

      if (Utils.isString(this.args[0]) && (expectedArgs === this.args.length || ElementCommand.isSelectorObject(this.args[1]))) {
        this.setStrategy(this.args.shift());
      }
    }
  }

  setStrategyFromArgs() {}

  setArguments() {
    this.validateArgsCount();
    this.setStrategyFromArgs();

    this.__selector = this.args.shift();

    this.setCallback();
    this.setOutputMessage();

    return this;
  }

  setOptionsFromSelector() {
    if (Utils.isObject(this.selector)) {
      const {
        abortOnFailure, retryInterval, message, timeout, locateStrategy
      } = this.selector;

      if (!Utils.isUndefined(abortOnFailure)) {
        this.abortOnFailure = Utils.convertBoolean(abortOnFailure);
      }

      if (!Utils.isUndefined(retryInterval)) {
        this.setRescheduleInterval(retryInterval);
      }

      if (message) {
        this.message = message;
      }

      if (locateStrategy) {
        this.setStrategy(locateStrategy);
      }

      if (!Utils.isUndefined(timeout)) {
        this.setMilliseconds(timeout);
      }
    }

    return this;
  }

  setNeedsRetry(val) {
    this.__needsRetry = val;

    return this;
  }

  setStrategy(val = this.defaultUsing) {
    this.__strategy = val;

    return this;
  }

  setOutputMessage() {
    this.message = null;
    if (this.args.length > 1) {
      if (Utils.isString(this.args[this.args.length - 1])) {
        this.message = this.args.pop();
      }
    }

    return this;
  }

  setCallback() {
    let callback = null;
    if (this.args.length && Utils.isFunction(this.args[this.args.length - 1])) {
      callback = this.args.pop();
    }

    this.__callback = callback || function() {};

    return this;
  }

  /**
   * @returns {ElementCommand}
   */
  createElement() {
    this.__element = Element.createFromSelector(this.selector, this.strategy);

    return this;
  }

  /*!
   * Reschedule the locate
   */
  reschedule(method = 'locate', args = []) {
    setTimeout(() => {
      this.retries++;
      this[method](...args);
    }, this.rescheduleInterval);
  }

  /**
   * @override
   * @param response
   * @returns {*}
   */
  elementFound(response) {
    this.elementId = response.value;

    return this.performActionWithElement(response);
  }

  /**
   * @override
   * @param result
   * @param now
   * @returns {ElementCommand}
   */
  elementNotFound(result) {
    this.complete(result, {});
  }

  elementLocateError(err) {
    if (err instanceof NoSuchElementError) {
      return this.elementNotFound(err);
    }

    Logger.error(err);

    this.complete(err, {});
  }

  initialize() {
    this.startTimer = new Date().getTime();
    this.deferred = Utils.createPromise();

    return this;
  }

  execute() {
    this.initialize();

    this.once('complete', (err, response) => {
      if (err instanceof Error) {
        this.deferred.reject(err);

        return;
      }

      this.deferred.resolve(response);
    });

    this.schedule();

    return this.currentPromise;
  }

  schedule() {
    this.locate()
      .then(response => this.elementFound(response))
      .catch(err => this.elementLocateError(err));
  }

  executeProtocolAction(actionName, args = []) {
    return this.transport.executeProtocolAction(actionName, [this.elementId, ...args]);
  }

  locate(deferred = Utils.createPromise()) {
    const {element, commandName} = this;

    this.elementLocator.findElement({element, commandName})
      .then(response => {
        if (this.transport.staleElementReference(response.result)) {
          this.locate(deferred);

          return;
        }

        if (response.value !== null && response.value !== undefined) {
          deferred.resolve(response);

          return;
        }

        if (this.shouldRetryLocate()) {
          // element wasn't found, schedule another check
          this.reschedule('locate', [deferred]);

          return;
        }

        const err = new NoSuchElementError(this.element, this.ms);
        deferred.reject(err);
      });

    return deferred.promise;
  }

  performActionWithElement(response) {
    return this.protocolAction()
      .then(result => {
        if (this.transport.staleElementReference(result)) {
          return this.schedule();
        }

        return result;
      });
  }

  complete(err, response) {
    try {
      let cbResult = this.callback.call(this.api, response, this);
      if (!(cbResult instanceof Promise)) {
        cbResult = Promise.resolve(cbResult);
      }

      return cbResult.then(_ => {
        this.emit('complete', err, response);
      });
    } catch (cbErr) {
      this.emit('complete', cbErr, response);
    }
  }

  handleElementError(err) {
    let shouldRegister;
    let callbackResult;
    let errorMessage;

    if (err instanceof Error) {
      callbackResult = {
        status: -1,
        value: {
          error: err.message,
          message: err.message,
          stack: err.stack
        }
      };
      errorMessage = err.message;
      shouldRegister = true;
    } else {
      callbackResult = err;
      shouldRegister = this.transport.shouldRegisterError(err);
      const error = (err.value && err.value.message || JSON.stringify(err));
      errorMessage = `An error occurred while running .${this.commandName}() command on <${this.element.toString()}>: ${error}`;
    }

    if (shouldRegister) {
      this.reporter.registerTestError(errorMessage);
    }

    return callbackResult;
  }

  shouldRetryLocate() {
    const now = new Date().getTime();

    return this.needsRetry && (now - this.startTimer < this.ms);
  }

  /**
   * Set the time in milliseconds to wait for the condition, accepting a given value or a globally defined default
   *
   * @param {number} [timeoutMs]
   */
  setMilliseconds(timeoutMs = this.api.globals.waitForConditionTimeout) {
    Utils.enforceType(timeoutMs, Utils.PrimitiveTypes.NUMBER);

    this.__timeoutMs = timeoutMs;

    return this;
  }

  setRescheduleInterval(intervalMs = this.api.globals.waitForConditionPollInterval) {
    Utils.enforceType(intervalMs, Utils.PrimitiveTypes.NUMBER);

    this.__rescheduleIntervalMs = intervalMs;

    return this;
  }
}

class NoSuchElementError extends Error {
  constructor(element, timeoutMs) {
    super();

    this.selector = element.selector;
    this.strategy = element.locateStrategy;
    this.message = `Timed out while waiting for element "${this.selector}" with "${this.strategy}" to be present for ${timeoutMs} milliseconds.`;
  }
}

module.exports = ElementCommand;
