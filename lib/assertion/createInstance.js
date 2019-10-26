const util = require('util');
const EventEmitter = require('events');
const Utils = require('../utils');
const Element = require('../element');
const {Logger} = Utils;

module.exports = function({assertionModule, nightwatchInstance = {}, fileName, args = [], options = {}} = {}) {
  const AssertionModule = Utils.isObject(assertionModule) && Utils.isFunction(assertionModule.assertion) ?
    assertionModule.assertion :
    assertionModule;

  util.inherits(AssertionModule, EventEmitter);

  class AssertionInstance extends AssertionModule {
    constructor({nightwatchInstance}) {
      super(...args);

      let msgReplaceArgs = this.args;

      this.fileName = fileName;
      this.__nightwatchInstance = nightwatchInstance;
      this.__negate = options.negate || false;
      if (Utils.isFunction(this.formatMessage)) {
        const format = this.formatMessage();

        this.message = format.message;

        if (this.message.includes('%s')) {
          msgReplaceArgs = format.args;
        }
      } else {
        msgReplaceArgs = msgReplaceArgs.map(arg => `'${arg}'`);
      }

      if (this.message.includes('%s')) {
        this.message = Logger.formatMessage(this.message, ...msgReplaceArgs);
      }

      EventEmitter.prototype.constructor.call(this);
    }

    set options(val) {
      this.__options = val;
    }

    get options() {
      return this.__options || {};
    }

    set args(value) {
      throw new Error(`Attempting to override ".args" which is a reserved property in "${fileName}".`);
    }

    set elementSelector(value) {
      throw new Error(`Attempting to override ".elementSelector" which is a reserved property in "${fileName}".`);
    }

    set api(value) {
      throw new Error(`Attempting to override ".api" which is a reserved property in "${fileName}".`);
    }

    get args() {
      return args;
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

    get elementSelector() {
      if (this.args[0] instanceof Element) {
        return `<${this.args[0].toString()}>`;
      }

      if (Utils.isObject(this.args[0]) && this.args[0].selector) {
        return this.args[0].selector ? `<${this.args[0].selector}>` : '';
      }

      const content = this.args[0];

      return this.options.elementSelector ? `<${content}>` : `'${content}'`;
    }

    hasFailure(result) {
      if (Utils.isFunction(this.failure)) {
        return this.failure(result);
      }

      return result === false || result && result.status === -1;
    }

    getValue(result) {
      if (Utils.isFunction(this.value)) {
        return this.value(result);
      }

      return result.value;
    }

    isOk(value) {
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

    getActual(result) {
      if (this.hasFailure(result)) {
        return this.options.elementSelector ?
          'element could not be located' :
          'an error occurred during the request'
      }

      if (Utils.isFunction(this.actual)) {
        const passed = this.evaluate(result.value);

        return this.actual(passed);
      }

      return this.getValue(result);
    }
  }

  return new AssertionInstance({nightwatchInstance});
};
