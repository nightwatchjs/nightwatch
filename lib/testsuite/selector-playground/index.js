const vm = require('vm');
const {crxfile} = require('nightwatch-selector-playground');
const Debuggability = require('../../utils/debuggability');
const Utils = require('../../utils');
const WebSocket = require('./websocket');
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
  addExtensionInChromeOption() {
    const chromeOptions = this.client.settings.desiredCapabilities['goog:chromeOptions'];
    
    this.client.settings.desiredCapabilities['goog:chromeOptions'] = {
      ...chromeOptions,
      extensions: [crxfile]
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////
  // Commands Execution and Response
  //////////////////////////////////////////////////////////////////////////////////////////

  modifyCommandsResult(result, executedCommand) {
    let error;

    if (Utils.isErrorObject(result) || result.error) {
      result = result.message;
      error = true;
    } else if (!result) {
      result = 'Success';
    }

    return JSON.stringify({
      result: result,
      error: error,
      executedCommand: executedCommand
    });
  }

  async executeCommands(data) {
    let result;
    const context = {browser: this.client.api};
    const message = data.toString();

    try {
      vm.createContext(context);

      Logger.log('Executed from browser : ', message);
      result = await vm.runInContext(message, context);
    } catch (err) {
      result = err;
    }

    return this.modifyCommandsResult(result, message);
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
