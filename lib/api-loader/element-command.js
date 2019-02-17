const BaseCommandLoader = require('./_base-loader.js');
const ElementCommand = require('../element/command.js');

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

    this.__protocolCommands = protocolInstance.Actions;
    this.__protocolInstance = protocolInstance;
  }

  get protocolCommands() {
    return this.__protocolCommands;
  }

  get protocolInstance() {
    return this.__protocolInstance;
  }

  createInstance(extraArgsCount) {
    let ClassName = this.module || ElementCommand;

    this.__instance = new ClassName({
      args: this.args,
      extraArgsCount,
      commandName: this.commandName,
      nightwatchInstance: this.nightwatchInstance,
      hasStrategy: !this.module
    });
  }

  get protocolAction() {
    return () => {
      const action = ElementCommandLoader.elementApiMappings[this.commandName];
    };
  }

  executeCommand() {
    this.instance.locate()
      .then(result => {
        if (!this.transport.isResultSuccess(result)) {
          throw result;
        }

        if (result.value === null) {
          throw new NoSuchElementError(this.instance);
        }

        this.args.unshift(result.value);

        return this.protocolCommands[protocolAction].apply(this.protocolInstance, this.args);
      })
      .then(result => {
        if (!this.transport.isResultSuccess(result) && this.transport.shouldRegisterError(result)) {
          throw result;
        }

        return result;
      })
      .catch(err => {
        return this.handleElementError(err);
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

  createWrapper(extraArgsCount = 0) {
    let command = this;

    this.commandFn = function commandFn(...args) {
      command.args = args;
      command.stackTrace = commandFn.stackTrace;
      command.createInstance(extraArgsCount);

      return command.executeCommand();
    };

    return this;
  }
}

module.exports = ElementCommandLoader;
