const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const Logger = require('../util/logger.js');
const PeriodicPromise = require('../util/periodic-promise.js');
const LocateStrategy = require('../util/locatestrategy.js');
const Element = require('../element/element.js');

class ElementCommand extends EventEmitter {
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

  get retryOnValid() {
    return false;
  }

  get retryOnValidActionResult() {
    return false;
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

  /**
   * @override
   * @returns {*}
   */
  protocolAction() {
    return Promise.resolve();
  }

  constructor({nightwatchInstance, commandName, args}) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.__commandName = commandName;

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
    this.setupExecutor();
  }

  setupExecutor() {
    const staleCondition = (response) => this.transport.staleElementReference(response.result);
    const validCondition = (response) => (response.value !== null && response.value !== undefined);
    const errorHandler = (err) => this.elementLocateError(err);
    const initialAction = () => this.findElement();
    const performActionWithResult = (response) => this.elementFound(response);

    this.executor = new PeriodicPromise({
      errorHandler,
      rescheduleInterval: this.rescheduleInterval,
      timeout: this.ms
    });

    this.executor
      .queueAction({
        action: initialAction,
        retryOnSuccess: this.retryOnValid,
        validate: validCondition
      })
      .queueAction({
        action: performActionWithResult,
        retryOnSuccess: this.retryOnValidActionResult,
        validate: validCondition,
        isResultStale: staleCondition
      });
  }

  execute() {
    return this.executor.run();
  }

  /**
   * @override
   * @param [response]
   * @returns {*}
   */
  elementFound(response) {
    if (response) {
      this.elementId = response.value;
    }

    return this.protocolAction();
  }

  /**
   * @override
   * @param result
   * @returns {ElementCommand}
   */
  elementNotFound(result) {
    return this.complete(result, {});
  }

  elementLocateError(err) {
    if (err instanceof NoSuchElementError) {
      return this.elementNotFound(err);
    }
    Logger.error(err);

    return this.complete(err, {});
  }

  async findElement() {
    const {element, commandName} = this;

    try {
      return await this.elementLocator.findElement({element, commandName});
    } catch (err) {
      throw new NoSuchElementError(this.element, this.ms);
    }
  }

  executeProtocolAction(actionName, args = []) {
    return this.transport.executeProtocolAction(actionName, [this.elementId, ...args]);
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

    this.setOutputMessage();
    this.setCallback();

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
