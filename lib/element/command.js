const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const LocateStrategy = require('../util/locatestrategy.js');
const Element = require('../element/element.js');
const ELEMENT_COMMAND_ARGS = 3;

class ElementCommand extends EventEmitter{
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

  get rescheduleIntervalMs() {
    return this.__rescheduleIntervalMs;
  }

  get timeoutMs() {
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

  constructor({nightwatchInstance, commandName, extraArgsCount, args, hasStrategy}) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.__commandName = commandName;
    this.__needsRetry = true;
    this.__strategy = this.defaultUsing;
    this.elementId = null;
    this.args = args;

    this.setArguments({hasStrategy, extraArgsCount});
    this.setMilliseconds();
    this.setRescheduleInterval();
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

  setArguments({hasStrategy, extraArgsCount}) {
    const expectedArgs = ELEMENT_COMMAND_ARGS + extraArgsCount;

    this.addCallbackArgument();

    // if the element command wasn't loaded from an existing command file
    if (hasStrategy) {
      this.prependStrategyArgument(expectedArgs);

      if (this.args.length < expectedArgs - 1 || this.args.length > expectedArgs) {
        throw new Error(`${this.commandName} method expects ${(expectedArgs - 1)} `+
          `(or ${expectedArgs} if using implicit "css selector" strategy) arguments - ${this.args.length} given.`);
      }

      this.__strategy = this.args.shift();
    }

    this.__selector = this.args.shift();
    this.__callback = this.args.pop();

    return this;
  }

  setOptionsFromSelector() {
    if (Utils.isObject(this.selector)) {
      const {
        abortOnFailure, retryInterval, message, timeout
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

      if (!Utils.isUndefined(timeout)) {
        this.setMilliseconds(timeout);
      }
    }

    return this;
  }

  addCallbackArgument() {
    if (!Utils.isFunction(this.args[this.args.length-1])) {
      this.args.push(function() {});
    }

    return this;
  }

  /**
   * If we're one argument short, assume the missing argument is the strategy (css selector/xpath)
   *
   * @returns {boolean}
   */
  needsStrategyArgument(expectedArgs) {
    return (expectedArgs - this.args.length) === 1;
  }

  prependStrategyArgument(expectedArgs) {
    if (this.needsStrategyArgument(expectedArgs)) {
      this.args.unshift(this.defaultUsing);
    }

    return this;
  }

  setNeedsRetry(val) {
    this.__needsRetry = val;

    return this;
  }

  setStrategy(val) {
    this.__strategy = val;

    return this;
  }

  execute(milliseconds) {
    this.startTimer = new Date().getTime();
    this.setMilliseconds(milliseconds);

    return this.locate();
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
  reschedule(method = 'locate') {
    setTimeout(() => {
      this[method]();
    }, this.rescheduleIntervalMs);
  }

  /**
   * @override
   * @param response
   * @returns {*}
   */
  elementFound(response) {
    this.elementId = response.value;

    return this.performActionWithElement();
  }

  /**
   * @override
   * @param result
   * @param now
   * @returns {ElementCommand}
   */
  elementNotFound({result, now}) {
    throw new NoSuchElementError(this.element);
  }

  locate() {
    return this.elementLocator
      .findElement(this.element, this.commandName)
      .then(response => {
        if (this.transport.staleElementReference(result)) {
          return this.locate();
        }

        if (this.transport.isResultSuccess(result)) {
          return this.elementFound(response);
        }

        if (this.shouldRetryLocate()) {
          // element wasn't found, schedule another check
          this.reschedule();

          return this;
        }

        return this.elementNotFound(response);
      })
      // .catch(err => this.handleElementError(err))
      // .then(result => this.complete(result));

  }

  shouldRetryLocate() {
    const now = new Date().getTime();

    return this.needsRetry && (now - this.startTimer < this.timeoutMs);
  }

  performActionWithElement() {
    return this.protocolAction()
      .then(result => {
        if (this.transport.staleElementReference(result)) {
          return this.locate();
        }

        if (!this.transport.isResultSuccess(result)) {
          throw result;
        }

        return result;
      });
  }

  complete(err, result) {
    return this.callback.call(this.api, result)
      .then(_ => {
        return err || result;
      });
  }

  handleElementError(err) {
    let shouldRegister;
    let callbackResult;

    if (err instanceof Error) {
      callbackResult = {
        status: -1,
        value: {
          error: err.message,
          message: err.message,
          stack: err.stack
        }
      };
      err = err.message;
      shouldRegister = true;
    } else {
      callbackResult = err;
      shouldRegister = this.transport.shouldRegisterError(err);
    }

    if (shouldRegister) {
      let error = Utils.isString(err) ? err : (err.value && err.value.message || JSON.stringify(err));
      let errorMessage = `An error occurred while running .${this.commandName}() command on <${this.element.toString()}>: ${error}`;
      this.reporter.registerTestError(errorMessage);
    }

    return callbackResult;
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
  constructor(element) {
    super();

    this.selector = element.selector;
    this.strategy = element.locateStrategy;
    this.message = `No element was found in the current page using "${this.selector}" selector and "${this.strategy}" strategy.`;
  }
}

module.exports = ElementCommand;
