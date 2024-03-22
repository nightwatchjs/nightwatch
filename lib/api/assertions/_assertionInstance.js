const util = require('util');
const EventEmitter = require('events');
const Utils = require('../../utils');
const Element = require('../../element');
const {Logger} = Utils;


class AssertionInstance {
  static isElementNotFoundResult(result) {
    if (!result) {
      return false;
    }

    if (result.status === -1) {
      result.value = result.value || [];

      return result.value.length === 0;
    }

    return false;
  }

  static init({nightwatchInstance, args, fileName, options}) {
    if (Utils.isFunction(args[args.length - 1])) {
      this.__doneCallback = args.pop();
    } else {
      this.__doneCallback = function(result) {
        return Promise.resolve(result);
      };
    }

    this.__nightwatchInstance = nightwatchInstance;
    this.__args = args;
    this.fileName = fileName;
    this.__negate = options.negate || false;
    this.__commandResult = null;
    this.retryAssertionTimeout = Utils.isObject(args[0]) ? args[0].timeout : undefined;
    this.rescheduleInterval = Utils.isObject(args[0]) ? args[0].retryInterval : undefined;
  }

  constructor({nightwatchInstance, args, fileName, options} = {}, skipInit = false) {
    if (!skipInit) {
      AssertionInstance.init.call(this, {nightwatchInstance, args, fileName, options});
      EventEmitter.prototype.constructor.call(this);
    }
  }

  initialize() {
    let msgReplaceArgs = this.args;

    if (Utils.isFunction(this.formatMessage)) {
      const format = this.formatMessage();

      this.message = format.message;
      if (this.message.includes('%s')) {
        msgReplaceArgs = format.args;
      }
    } else {
      msgReplaceArgs = msgReplaceArgs.map(arg => {
        if (Utils.isObject(arg) && arg.selector) {
          return `'<${arg.selector}>'`;
        }

        return `'${arg}'`;
      });
    }

    if (this.message && this.message.includes('%s')) {
      this.message = Logger.formatMessage(this.message, ...msgReplaceArgs);
    }
  }

  set options(val) {
    this.__options = val;
  }

  get options() {
    return this.__options || {};
  }

  get result() {
    return this.__commandResult;
  }

  set args(value) {
    throw new Error(`Attempting to override ".args" which is a reserved property in "${this.fileName}".`);
  }

  set elementSelector(value) {
    throw new Error(`Attempting to override ".elementSelector" which is a reserved property in "${this.fileName}".`);
  }

  set api(value) {
    throw new Error(`Attempting to override ".api" which is a reserved property in "${this.fileName}".`);
  }

  get args() {
    return this.__args;
  }

  get negate() {
    return this.__negate;
  }

  /**
   * @deprecated
   */
  get client() {
    return this.__nightwatchInstance.client;
  }

  get api() {
    return this.__nightwatchInstance.api;
  }

  get doneCallback() {
    return this.__doneCallback;
  }

  set doneCallback(value) {
    this.__doneCallback = value;
  }

  get elementSelector() {
    if (this.args[0] instanceof Element) {
      return `<${this.args[0].toString()}>`;
    }

    if (Utils.isObject(this.args[0]) && this.args[0].selector) {
      return this.args[0].selector ? `<${this.args[0].selector}>` : '';
    }

    if (Utils.isObject(this.args[0]) && this.args[0].webElementLocator) {
      return `<${this.args[0].webElementLocator}>`;
    }

    if (this.args[0].id_ && this.args[0].driver_) {
      return '<WebElement>';
    }

    const content = this.args[0];

    return this.options.elementSelector ? `<${content}>` : `'${content}'`;
  }

  runFailure() {
    const isFailed = this.failure(this.result);

    if (isFailed && this.message.includes('%s')) {
      this.message = Logger.formatMessage(this.message, this.args);
    }

    return isFailed;
  }

  hasFailure() {
    if (Utils.isFunction(this.failure)) {
      return this.runFailure();
    }

    if (!this.result || this.result.status === -1) {
      return true;
    }

    const {error} = this.result;

    return (error instanceof Error) && error.name !== 'NoSuchElementError';
  }

  getValue() {
    if (Utils.isObject(this.result) && Utils.isUndefined(this.result.value) || this.result.status === -1) {
      return null;
    }

    if (Utils.isFunction(this.value)) {
      const result = this.value(this.result);
      if (result === undefined) {
        return null;
      }

      return result;
    }

    return this.result.value;
  }

  isOk(value = '') {
    let passed;

    // Backwards compatibility check:
    //  if there is a "pass" function declared, treat it like "evaluate" because "pass"
    //  needs to take the negate into account now
    if (Utils.isFunction(this.pass)) {
      passed = this.pass(value);
    } else {
      passed = this.evaluate(value);
    }

    return this.negate ? !passed : passed;
  }

  getActual() {
    if (this.hasFailure()) {
      const elementNotFound = AssertionInstance.isElementNotFoundResult(this.result);

      return this.options.elementSelector ? (elementNotFound ? 'element could not be located' : 'error while locating the element') : '';
    }

    if (Utils.isFunction(this.actual)) {
      const passed = this.evaluate(this.result.value);

      return this.actual(passed);
    }

    return this.getValue();
  }

  /**
   * @param {Object} result
   */
  setResult(result) {
    this.__commandResult = result;
  }

}

module.exports.create = function(opts = {}) {
  const {assertionModule, nightwatchInstance = {}, fileName, args = [], options = {}} = opts;

  if (assertionModule.prototype && assertionModule.prototype.constructor.toString().startsWith('class')) {
    const err = new Error('ES6 class assertions are not supported yet.');
    err.help = [
      'Please use the module.exports = function() { ... } syntax instead',
      'If you have an ESM project, you need to use the .cjs extension'
    ];
    err.link = 'https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html';

    throw err;
  }

  const AssertionModule = Utils.isObject(assertionModule) && Utils.isFunction(assertionModule.assertion) ?
    assertionModule.assertion :
    assertionModule;

  util.inherits(AssertionModule, EventEmitter);
  util.inherits(AssertionInstance, AssertionModule);

  const instance = new AssertionInstance({nightwatchInstance, args, fileName, options});
  // call the assertion function

  AssertionModule.prototype.constructor.apply(instance, args);

  instance.initialize();

  return instance;
};
