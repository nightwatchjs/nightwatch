const chai = require('chai-nightwatch');
const CommandQueue = require('../core/queue.js');
const flag = chai.flag;
const BaseCommandLoader = require('./_base-loader.js');
const Element = require('../page-object/element.js');

class ExpectElementLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.startTime = null;
    this.resolve = null;
    this.reject = null;

    this.promise = this.createPromise();

    this.__instance = chai.expect(this.promise);

    flag(this.instance, 'promise', this.promise);
  }

  createPromise() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  createElement(selector, using) {
    using = using || this.nightwatchInstance.locateStrategy;

    this.element = Element.createFromSelector(selector, using);
    this.startTime = new Date().getTime();

    flag(this.instance, 'selector', selector);
    flag(this.instance, 'element', this.element);
    flag(this.instance, 'emitter', this);

    return this;
  }

  locateElement() {
    this.transport
      .locateElement(this.element)
      .then(elementId => {
        this.resolve(elementId);
      })
      .catch(result => {
        this.reject(result);
        // TODO: Error handling
      });

    return this.instance;
  }

  executeProtocolAction(protocolAction, elementId, args) {
    args = args || [];

    if (!Array.isArray(args)) {
      args = [args];
    }

    args.unshift(elementId);

    return this.transport.executeProtocolAction(protocolAction, this.sessionId, args);
  }

  isResultSuccess(result) {
    return this.transport.isResultSuccess(result);
  }

  createWrapper() {
    let self = this;

    this.commandFn = function commandFn(...args) {
      self.stackTrace = commandFn.stackTrace;
      self.createElement(args);

      return self.locateElement();
    };

    return this;
  }

  define(parent = null) {
    let commandName = 'element';
    let self = this;
    let command = this.commandFn;
    let namespace = (parent || this.api).expect;

    this.nightwatchInstance.setApiMethod(commandName, namespace, function commandFn(...args) {

      let originalStackTrace = ExpectElementLoader.getOriginalStrackTrace(commandFn);
      CommandQueue.add(commandName, command, self, [], originalStackTrace);

      return this.instance;
    }.bind(this.api));
  }
}

module.exports = ExpectElementLoader;