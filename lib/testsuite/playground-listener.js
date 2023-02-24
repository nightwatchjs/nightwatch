const vm = require('vm');
const {WebSocketServer} = require('ws');
const {crxfile} = require('nightwatch-selector-playground');
const Debuggability = require('../utils/debuggability');
const Utils = require('../utils');
const {Logger} = Utils;

module.exports = class SelectorPlaygroundServer {
  constructor() {
    this.finishCallback = null;
    this.portNumber = 8080;
  }

  setClient(client) {
    this.client = client;
  }

  addExtensionInChromeOption() {
    const chromeOptions = this.client.settings.desiredCapabilities['goog:chromeOptions'];
    
    this.client.settings.desiredCapabilities['goog:chromeOptions'] = {
      ...chromeOptions,
      extensions: [crxfile]
    };
  }

  startServer() {
    this._wss = new WebSocketServer({port: this.portNumber});

    this._wss.on('error', (error) => {
      this.handleSocketError(error);
    });
  
    this._wss.on('listening', () => {
      Logger.log(`WebSocket server is listening on port ${this.portNumber}`);
    });

    this._wss.on('connection', (ws) => {
      ws.on('message', async (data) => {
        Debuggability.debugMode = true;
        const isES6AsyncTestcase = this.client.isES6AsyncTestcase;
        this.client.isES6AsyncTestcase = true;
  
        const context = {browser: this.client.api};
        vm.createContext(context);
        
        let result;
        let error;
        try {
          const message = data.toString();
          Logger.log('Executed from browser : ', message);
          
          result = await vm.runInContext(message, context);
        } catch (err) {
          result = err;
        }

        if (Utils.isErrorObject(result)) {
          result = result.message;
          error = true;
        } else if (!result) {
          result = 'Success';
        }

        ws.send(JSON.stringify({
          result: result,
          error: error,
          executedCommand: data.toString()
        }));

        this.client.isES6AsyncTestcase = isES6AsyncTestcase;
        Debuggability.debugMode = false;
      });
    });
  }

  handleSocketError(e) {
    if (e.code === 'EADDRINUSE') {
      Logger.warn(`Port ${this.portNumber} is already in use. Trying the next available port.`);
      this.portNumber++;
    } else {
      Logger.error(`Could not start WebSocket server on port ${this.portNumber}: ${e.message}`);
    }

    this.initSocket();
  }

  initSocket() {
    try {
      this.startServer();
    } catch (e) {
      this.handleSocketError(e);
    }
  }

  async createExtension () {
    this.addExtensionInChromeOption();
  }

  get nwsocket() {
    return this._wss;
  }

  closeSocket(err) {
    if (this.finishCallback) {
      this.finishCallback(err);
    }

    this.nwsocket.close();
  }
};
