const events = require('events');
const BaseCommandLoader = require('./_base-loader.js');
const Element = require('../page-object/element.js');

class ElementInstance extends events.EventEmitter {
  constructor(selector, using) {
    this.selector = selector;
    this.using = using;
    this.startTime = null;
    this.emitter = null;
    this.createPromise();
    this.__instance = Element.createFromSelector(selector, using);
  }
}

Element.prototype.getElementsCommand = function(callback) {
  this.locator = this.using || client.locateStrategy || 'css selector';
  return Protocol.elements(this.locator, this.selector, callback);
};

Element.prototype.promise = function() {
  return this.deferred.promise;
};

Element.prototype.createPromise = function() {
  this.deferred = Q.defer();
  return this.deferred.promise;
};

Element.prototype.locate = function(emitter) {
  if (emitter) {
    this.emitter = emitter;
    this.startTime = new Date().getTime();
  }

  this.getElementsCommand(function(result) {
    if (result.status !== 0 || !result.value || result.value.length === 0) {
      this.deferred.reject(result);
    } else {
      this.deferred.resolve(result.value[0]);
    }
  }.bind(this));
}

class ExpectAssertionLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);
  }

  createInstance(args, extraArgsCount) {
    this.args = args;
    this.expectedArgs = ELEMENT_COMMAND_ARGS + (extraArgsCount || 0);

    this.addCallbackArgument();
    this.addStrategyArgument();

    if (args.length < this.expectedArgs - 1 || args.length > this.expectedArgs) {
      throw new Error(`${this.commandName} method expects ${(this.expectedArgs - 1)} (or ${this.expectedArgs} if using implicit "css selector" strategy) arguments - ${args.length} given.`);
    }

    this.__strategy = args.shift();
    this.__value = args.shift();
    this.__callback = args.pop();
    this.__instance = Element.createFromSelector(this.value, this.strategy);
  }

  executeCommand() {
    this.nightwatchInstance
      .transport.executeElementCommand(this.instance, this.nightwatchInstance.session.sessionId, this.commandName, this.args)
      .then(result => {
        if (result.status === -1) {
          let errorMessage = 'ERROR: Unable to locate element: "' + this.instance.selector + '" using: "' + this.instance.locateStrategy + '"';
          //let stack = this.stackTrace.split('\n');

          //stack.shift();
          //Utils.showStackTraceWithHeadline(errorMessage, stack);

          // client.results.errors++;
          // client.errors.push(errorMessage + '\n' + stack.join('\n'));
        }

        this.callback.call(this.api, result);
        this.emit('complete');
      });

    return this;
  }

  createWrapper(extraArgsCount) {
    let command = this;

    this.commandFn = function commandFn(...args) {
      command.stackTrace = commandFn.stackTrace;
      command.createInstance(args, extraArgsCount);

      return command.executeCommand();
    };

    return this;
  }
}

module.exports = ElementCommandLoader;