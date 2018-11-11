const BaseCommandLoader = require('./_base-loader.js');
const Element = require('../page-object/element.js');
const LocateStrategy = require('../util/locatestrategy.js');
const ELEMENT_COMMAND_ARGS = 3;

class ElementCommandLoader extends BaseCommandLoader {
  static get elementApiMappings() {
    return {
      click: 'elementIdClick',
      clearValue: 'elementIdClear',
      getAttribute: 'elementIdAttribute',
      getCssProperty: 'elementIdCssProperty',
      getElementSize: 'elementIdSize',
      getLocation: 'elementIdLocation',
      getLocationInView: 'elementIdLocationInView',
      getTagName: 'elementIdName',
      getText: 'elementIdText',
      getValue: 'elementIdValue',
      isVisible: 'elementIdDisplayed',
      moveToElement: 'moveTo',
      setValue: 'elementIdValue',
      sendKeys: 'elementIdValue',
      submitForm: 'submit',
    };
  }

  constructor(nightwatchInstance, protocolInstance) {
    super(nightwatchInstance);

    this.__strategy = null;
    this.__value = null;
    this.__callback = null;
    this.__protocolCommands = protocolInstance.Actions;
    this.__protocolInstance = protocolInstance;
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

  get protocolCommands() {
    return this.__protocolCommands;
  }

  get protocolInstance() {
    return this.__protocolInstance;
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
    this.transport
      .locateElement(this.instance)
      .then(result => {
        if (!this.transport.isResultSuccess(result)) {
          throw result;
        }

        let protocolAction = ElementCommandLoader.elementApiMappings[this.commandName];

        this.args.unshift(result.value);

        return this.protocolCommands[protocolAction].apply(this.protocolInstance, this.args);
      })
      .then(result => {
        if (!this.transport.isResultSuccess(result) && this.transport.shouldRegisterError(result)) {
          throw result;
        }

        return result;
      })
      .catch(result => {
        let shouldRegister;
        let callbackResult;

        if (result instanceof Error) {
          callbackResult = {
            status: -1,
            value: {
              error: result.message,
              message: result.message,
              stack: result.stack
            }
          };
          result = result.stack;
          shouldRegister = true;
        } else {
          callbackResult = result;
          shouldRegister = this.transport.shouldRegisterError(result);
        }

        if (shouldRegister) {
          let error = typeof result == 'string' ? result : (result.value && result.value.message || JSON.stringify(result));
          let errorMessage = `An error occurred while running .${this.commandName}() command on <${this.instance.toString()}>: ${error}`;
          this.reporter.registerTestError(errorMessage);
        }

        return callbackResult;
      })
      .then(result => {
        return this.callback.call(this.api, result);
      })
      .catch(cbError => {
        return cbError;
      })
      .then(cbResult => {
        if (cbResult instanceof Error) {
          this.emit('error', cbResult);

          return;
        }

        this.emit('complete', cbResult);
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