const vm = require('vm');
const {crxfile} = require('@nightwatch/nightwatch-inspector');
const stripAnsi = require('strip-ansi');
const Debuggability = require('../../utils/debuggability');
const Utils = require('../../utils');
const WebSocket = require('./websocket-server.js');
const {Logger} = Utils;

module.exports = class NightwatchInspectorServer extends WebSocket {
  constructor(client) {
    super();
    this.client = client;
    this.initSocket(this.playgroundWrapper.bind(this));
    this.addExtensionInChromeOption();
  }

  /**
   * Adds extensions capabilities to the Chrome options
   */
  addExtensionInChromeOption() {
    const {desiredCapabilities} = this.client.settings;
    const chromeOptions = desiredCapabilities['goog:chromeOptions'];
    const {args = []} = chromeOptions || {};

    desiredCapabilities['goog:chromeOptions'] = {
      ...chromeOptions,
      extensions: [crxfile],
      args: [...args, '--auto-open-devtools-for-tabs']
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
      result = stripAnsi(result);
      error = true;
    }

    return JSON.stringify({
      result: result,
      error: error,
      executedCommand: executedCommand,
      commandList: commandList
    });
  }

  getNightwatchCommands() {
    const {api} = this.client;
    const {assert, expect, verify, ensure} = api;

    return [
      'browser',
      ...[api, assert, expect, verify, ensure].reduce((keys, obj) => keys.concat(Object.keys(obj)), [])
    ];
  }

  async executeCommands(data) {
    let result;
    const context = {browser: this.client.api};
    const message = data.toString().replace('await ', '');

    if (message === 'commandlist') {
      const commandList = this.getNightwatchCommands();

      return this.modifyCommandsResult(null, message, commandList);
    }

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
