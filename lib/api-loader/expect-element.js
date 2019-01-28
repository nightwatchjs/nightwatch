const chai = require('chai-nightwatch');
const flag = chai.flag;
const BaseCommandLoader = require('./_base-loader.js');
const Logger = require('../util/logger.js');
const Element = require('../page-object/element.js');

class ExpectElementLoader extends BaseCommandLoader {
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

  createElement(selector, using = this.nightwatchInstance.locateStrategy) {
    this.element = Element.createFromSelector(selector, using);
    this.startTime = new Date().getTime();

    flag(this.instance, 'selector', selector);
    flag(this.instance, 'element', this.element);
    flag(this.instance, 'emitter', this);

    return this;
  }

  locateElement() {
    this.transport
      .locateMultipleElements(this.element)
      .then(result => {
        if (!this.element.usingRecursion) {
          result = this.transport.resolveElement(result, this.element, true);
        } else if (result.value) {
          result.value = result.value[0];
        }

        if (result && result.value) {
          this.elementId = result.value;

          return this.resolve(this.elementId);
        }

        throw result;
      })
      .catch(result => {
        if (result instanceof Error) {
          Logger.error(result);
        }
        this.reject(result);
      });

    return this.instance;
  }

  createWrapper() {
    this.commandFn = function commandFn(...args) {
      this.stackTrace = commandFn.stackTrace;
      this.createElement(...args);

      this.locateElement();

      this.promise.catch(err => {
        if (!(this.instance instanceof chai.Assertion)) {
          this.emit('error', new Error('Element was not found.'));
        }
      });

      return this.instance;
    };
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

  static define(nightwatchInstance, parent = null) {
    let commandName = 'element';
    let namespace = (parent || nightwatchInstance.api).expect;

    nightwatchInstance.setApiMethod(commandName, namespace, function commandFn(...args) {
      let expectInstance = new ExpectElementLoader(nightwatchInstance);
      let originalStackTrace = ExpectElementLoader.getOriginalStackTrace(commandFn);

      nightwatchInstance.session.commandQueue.add(commandName, expectInstance.commandFn, expectInstance, args, originalStackTrace);

      return expectInstance.instance;
    });
  }
}

module.exports = ExpectElementLoader;