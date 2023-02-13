const {Logger} = require('../utils');

const { WebSocketServer } = require('ws');

module.exports = class SelectorPlaygroundServer {

  initSocket(client){
    this._wss = new WebSocketServer({ port: 8080 });

    this._wss.on('connection', (ws) => {
      ws.on('message', async (data) => {
        const isES6AsyncTestcase = client.isES6AsyncTestcase;
        client.isES6AsyncCommand = true;
  
        const vm = require('vm');
        const context = {browser: client.api};
        vm.createContext(context);
        Logger.log('Executed from browser : ', data.toString());
  
        const result = await vm.runInContext(data.toString(), context);
        ws.send(JSON.stringify(result));
  
        client.isES6AsyncCommand = isES6AsyncTestcase;
      });
    });
  }

  constructor(client) {
    this.finishCallback = null;
    this.initSocket(client);
  }

  get nwsocket() {
    return this._wss;
  }

  closeSocket(err) {
    if (this.finishCallback) {
      this.finishCallback(err);
    }

    this.nwsocket.close()
  }
};
