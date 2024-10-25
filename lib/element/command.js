const EventEmitter = require('events');
const {WebElement} = require('selenium-webdriver');

const Utils = require('../utils');
const LocateStrategy = require('./strategy.js');
const Element = require('./index.js');
const {NoSuchElementError} = require('./locator.js');
const {Logger, PeriodicPromise, isDefined} = Utils;

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

  get retryOnSuccess() {
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

  get abortOnFailure() {
    return this.__abortOnFailure;
  }

  set abortOnFailure(value) {
    this.__abortOnFailure = Utils.convertBoolean(value);
  }

  get suppressNotFoundErrors() {
    return this.__suppressNotFoundErrors;
  }

  set suppressNotFoundErrors(value) {
    this.__suppressNotFoundErrors = Utils.convertBoolean(value);
  }

  /**
   * @override
   * @returns {*}
   */
  protocolAction() {
    return Promise.resolve();
  }

  isResultSuccess(result) {
    return this.transport.isResultSuccess(result) && result.value !== null;
  }

  protocolActionHandler() {
    return Promise.resolve();
  }

  constructor({nightwatchInstance, commandName, args, requireValidation = true} = {}) {
    super();

    this.nightwatchInstance = nightwatchInstance || this.client; //custom commands don't get the nightwatchInstance
    this.__commandName = commandName || this.commandFileName;

    this.transport.registerLastError(null);
    this.setStrategy();

    this.suppressNotFoundErrors = false;
    this.abortOnFailure = this.api.globals.abortOnAssertionFailure;
    this.throwOnMultipleElementsReturned = this.api.globals.throwOnMultipleElementsReturned;
    this.elementId = null;
    this.args = Array.isArray(args) && args.slice(0) || this.commandArgs || [];

    this.setMilliseconds();
    this.setRescheduleInterval();
    this.setArguments(requireValidation);
    this.setOptionsFromSelector();
    this.createElement();

    this.setupExecutor();
    this.setupActions();
  }

  setupExecutor() {
    this.executor = new PeriodicPromise({
      rescheduleInterval: this.rescheduleInterval,
      timeout: this.ms
    });
  }

  setupActions() {
  }

  command() {
    return this.executor.run();
  }

  /**
   * @override
   * @param [response]
   * @returns {*}
   */
  elementFound(response) {
    if (response) {
      if (this.isSeleniumWebElement(response.value)) {
        this.webElement = response.value;
      } else if (isDefined(response.value)) {
        this.elementId = this.transport.getElementId(response.value);
      } else {
        this.elementId = response;
      }
    }

    return this.protocolAction();
  }

  isSeleniumWebElement(value) {
    return (value instanceof WebElement);
  }
  /**
   * @override
   * @param err
   * @returns {ElementCommand}
   */
  elementNotFound(err) {
    return this.complete(err, err.result);
  }

  elementLocateError(err) {
    if (err instanceof NoSuchElementError) {
      return this.elementNotFound(err);
    }

    Logger.error(err);

    return this.complete(err, {});
  }

  async findElement({returnSingleElement = true, cacheElementId = true} = {}) {
    const {element, commandName, WebdriverElementId} = this;

    try {
      if (WebdriverElementId) {
        return {
          value: this.transport.toElement(WebdriverElementId),
          status: 0,
          result: {}
        };
      }

      return await this.elementLocator.findElement({element, commandName, returnSingleElement, cacheElementId});
    } catch (err) {
      if (err.name === 'ReferenceError' || err.name === 'TypeError') {
        throw err;
      }

      throw this.noSuchElementError(err);
    }
  }

  executeProtocolAction(actionName, args = []) {
    const {sessionId} = this;
    let {elementId, webElement, selector} = this;

    if (webElement) {
      elementId = webElement;
    } else if (selector instanceof WebElement) {
      elementId = selector;
    }

    return this.transport.executeProtocolAction({actionName, args: [elementId, ...args], sessionId});
  }

  async complete(err, response) {
    try {
      await this.callback.call(this.api, response, this);

      if (err instanceof Error) {
        return err;
      }

      return response;
    } catch (cbErr) {
      return cbErr;
    }
  }

  validateArgsCount(requireValidation = true) {
    if (!requireValidation) {
      return this;
    }

    ////////////////////////////////////////////////////////////////////////////
    // if there is an element command such as getText, getAttribute etc., verify if the
    // expected number of args have been supplied
    ////////////////////////////////////////////////////////////////////////////
    if (this.args.length && !Utils.isFunction(this.args[this.args.length - 1])) {
      this.args.push(function() {});
    }

    if (this.extraArgsCount !== null) {
      let expectedArgs = ElementCommand.ELEMENT_COMMAND_ARGS + this.extraArgsCount;
      let passedArgs = this.args.length;
      let rejectPromise;

      if (this.client.isES6AsyncTestcase) {
        expectedArgs = expectedArgs - 1;
        passedArgs = passedArgs - 1;
        rejectPromise = true;
      }

      if (passedArgs < expectedArgs - 1 || passedArgs > expectedArgs) {
        const error = new Error(`${this.commandName} method expects ${(expectedArgs - 1)} ` +
          `(or ${expectedArgs} if using implicit "css selector" strategy) arguments - ${passedArgs} given.`);
        error.rejectPromise = rejectPromise;

        throw error;
      }

      if (Utils.isString(this.args[0]) && (expectedArgs === passedArgs || ElementCommand.isSelectorObject(this.args[1]))) {
        this.setStrategyFromArgs();
      }
    }
  }

  setStrategyFromArgs() {
    const strategy = this.args.shift();
    LocateStrategy.validate(strategy, this.commandName);

    this.setStrategy(strategy);
  }

  setArguments(requireValidation) {
    this.validateArgsCount(requireValidation);

    this.__selector = this.args.shift();

    this.setOutputMessage();
    this.setCallback();

    return this;
  }

  setOptionsFromSelector() {
    if (Utils.isObject(this.selector)) {
      const {
        abortOnFailure, retryInterval, message, timeout, locateStrategy, suppressNotFoundErrors, retryAction
      } = this.selector;

      if (!Utils.isUndefined(abortOnFailure)) {
        this.abortOnFailure = abortOnFailure;
      }

      if (!Utils.isUndefined(suppressNotFoundErrors)) {
        this.suppressNotFoundErrors = suppressNotFoundErrors;
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

      if (!Utils.isUndefined(retryAction)) {
        this.__retryOnFailure = retryAction;
      }

      const {WebdriverElementId} = this.selector;
      if (WebdriverElementId) {
        this.WebdriverElementId = WebdriverElementId;
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
    if (this.args.length > 0) {
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
    try {
      Utils.enforceType(timeoutMs, Utils.PrimitiveTypes.NUMBER);
    } catch (err) {
      throw new Error('waitForElement expects second parameter to have a global default (waitForConditionTimeout) ' +
        'to be specified if not passed as the second parameter');
    }

    this.__timeoutMs = timeoutMs;

    return this;
  }

  setRescheduleInterval(intervalMs = this.api.globals.waitForConditionPollInterval) {
    Utils.enforceType(intervalMs, Utils.PrimitiveTypes.NUMBER);
    this.__rescheduleIntervalMs = intervalMs;

    return this;
  }

  noSuchElementError(err) {
    const {element, ms, abortOnFailure} = this;
    const {retries} = err;

    return new NoSuchElementError({element, ms, abortOnFailure, retries});
  }
}

module.exports = ElementCommand;
