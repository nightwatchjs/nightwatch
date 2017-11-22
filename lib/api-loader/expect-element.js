const chai = require('chai-nightwatch');
const CommandQueue = require('../core/queue.js');
const flag = chai.flag;
const BaseCommandLoader = require('./_base-loader.js');
const Element = require('../page-object/element.js');

class ExpectElementLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.startTime = null;
    this.emitter = null;

    this.resolve = null;
    this.reject = null;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    this.__instance = chai.expect(this.promise);

    flag(this.instance, 'promise', this.promise);
  }

  createElement(selector, using) {
    this.element = Element.createFromSelector(selector, using);

    flag(this.instance, 'selector', selector);
    flag(this.instance, 'element', this.element);

    return this;
  }

  executeCommand() {
    this.nightwatchInstance
      .transport.locateElement(this.element, this.nightwatchInstance.session.sessionId)
      .then(elementId => {
        this.resolve(elementId);
      })
      .catch(result => {
        this.reject(result);
        // TODO: Error handling
      });

    return this.instance;
  }

  createWrapper() {
    let self = this;

    this.commandFn = function commandFn(...args) {
      self.stackTrace = commandFn.stackTrace;
      self.createElement(args);

      return self.executeCommand();
    };

    return this;
  }

  define() {
    let commandName = 'element';
    let self = this;
    let command = this.commandFn;

    this.nightwatchInstance.setApiMethod(commandName, 'expect', function commandFn(...args) {
      let originalStackTrace = ExpectElementLoader.getOriginalStrackTrace(commandFn);

      CommandQueue.add(commandName, command, self, [], originalStackTrace);

      return this;
    }.bind(this.nightwatchInstance.api));
  }
}

module.exports = ExpectElementLoader;