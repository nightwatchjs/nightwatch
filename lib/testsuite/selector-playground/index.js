const vm = require('vm');
const {crxfile} = require('nightwatch-selector-playground');
const Debuggability = require('../../utils/debuggability');
const Utils = require('../../utils');
const WebSocket = require('./playground-listener');
const {Logger} = Utils;

module.exports = class SelectorPlaygroundServer extends WebSocket {
  constructor() {
    super();
    this.initSocket(this.playgroundWrapper.bind(this));
  }

  setClient(client) {
    this.client = client;
  }

  /**
   * Adds extensions capabilities to the Chrome options
   */
  addExtensionInChromeOption(desiredCapabilities) {
    const chromeOptions = desiredCapabilities['goog:chromeOptions'];
    
    desiredCapabilities['goog:chromeOptions'] = {
      ...chromeOptions,
      extensions: [crxfile]
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Commands Execution and Response
  //////////////////////////////////////////////////////////////////////////////////////////

  modifyCommandsResult(result, executedCommand, commandList) {
    let error;

    if (!result) {
      result = 'Success';
    } else if (Utils.isErrorObject(result) || result.error) {
      result = result.message;
      error = true;
    }

    return JSON.stringify({
      result: result,
      error: error,
      executedCommand: executedCommand,
      commandList: commandList
    });
  }

  getNightwatchCommands(nightwatchAPI, commandList) {
    commandList.push('browser');
    commandList.push(...Object.keys(nightwatchAPI));
    commandList.push(...Object.keys(nightwatchAPI.assert));
    commandList.push(...Object.keys(nightwatchAPI.expect));
    commandList.push(...Object.keys(nightwatchAPI.verify));
    commandList.push(...Object.keys(nightwatchAPI.ensure));
  }
  async executeCommands(data) {
    let result;
    const context = {browser: this.client.api};
    const message = data.toString();
    const commandList = [];

    if (message === 'commandlist') {
      this.getNightwatchCommands(this.client.api, commandList);
    }

    try {
      vm.createContext(context);

      Logger.log('Executed from browser : ', message);
      result = await vm.runInContext(message, context);
    } catch (err) {
      result = err;
    }

    return this.modifyCommandsResult(result, message, commandList);
  }

  async playgroundWrapper(data) {
    const isES6AsyncTestcase = this.client.isES6AsyncTestcase;
    Debuggability.debugMode = true;
    this.client.isES6AsyncTestcase = true;

    const result = await this.executeCommands(data);

    this.client.isES6AsyncTestcase = isES6AsyncTestcase;
    Debuggability.debugMode = false;

    return result;
  }
};
