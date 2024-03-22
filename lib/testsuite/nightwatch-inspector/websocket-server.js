const {WebSocketServer} = require('ws');
const Utils = require('../../utils');
const {Logger} = Utils;

module.exports = class Websocket {
  constructor() {
    this.portNumber = 10096;
  }

  initSocket(cb) {
    try {
      this.startServer(cb);
    } catch (e) {
      this.handleSocketError(e, cb);
    }
  }

  startServer(cb) {
    this._wss = new WebSocketServer({host: 'localhost', port: this.portNumber});

    this._wss.on('error', (error) => {
      this.handleSocketError(error, cb);
    });

    this._wss.on('listening', () => {
      Logger.log(`WebSocket server is listening on port ${this.portNumber}`);
    });

    this._wss.on('connection', (ws) => {
      ws.on('message', async (data) => {
        const result = await cb(data);
        ws.send(result);
      });
    });
  }

  handleSocketError(e, cb) {
    if (e.code === 'EADDRINUSE') {
      Logger.warn(`Port ${this.portNumber} is already in use. Trying the next available port.`);
      this.portNumber++;
    } else {
      Logger.error(`Could not start WebSocket server on port ${this.portNumber}: ${e.message}`);
    }

    this.initSocket(cb);
  }

  get nwsocket() {
    return this._wss;
  }

  closeSocket() {
    Logger.info(`Attempting to close websocket server running on port ${this.portNumber}...`);

    this.nwsocket.close();
  }
};
