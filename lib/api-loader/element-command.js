const BaseCommandLoader = require('./_base-loader.js');
const Element = require('../page-object/element.js');
const LocateStrategy = require('../util/locatestrategy.js');
const ELEMENT_COMMAND_ARGS = 3;

class ElementCommandLoader extends BaseCommandLoader {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.__strategy = null;
    this.__value = null;
    this.__callback = null;
  }

  get defaultUsing() {
    return this.nightwatchInstance.locateStrategy || LocateStrategy.getDefault();
  }

  get strategy() {
    return this.__strategy;
  }

  get value() {
    return this.__value;
  }

  get callback() {
    return this.__callback;
  }

  addCallbackArgument() {
    if (typeof this.args[this.args.length-1] !== 'function') {
      this.args.push(function() {});
    }

    return this;
  }

  addStrategyArgument() {
    if (this.expectedArgs - this.args.length === 1) {
      this.args.unshift(this.defaultUsing);
    }

    return this;
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