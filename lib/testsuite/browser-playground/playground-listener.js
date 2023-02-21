const {Logger, isErrorObject} = require('../../utils');
const archiver = require('archiver');
const path = require('path');
const vm = require('vm');

const {WebSocketServer} = require('ws');
const Debuggability = require('../../utils/debuggability');

module.exports = class SelectorPlaygroundServer {
  constructor(client) {
    this.finishCallback = null;
  }

  setClient(client) {
    this.client = client;
  }

  addExtensionInChromeOption(crxBuffer) {
    const chromeOptions = this.client.settings.desiredCapabilities['goog:chromeOptions'];
    
    this.client.settings.desiredCapabilities['goog:chromeOptions'] = {
      ...chromeOptions,
      extensions: [crxBuffer]
    };
  }

  initSocket(){
    this._wss = new WebSocketServer({port: 8080});

    this._wss.on('connection', (ws) => {
      ws.on('message', async (data) => {
        Debuggability.debugMode = true;
        const isES6AsyncCommand = this.client.isES6AsyncCommand;
        this.client.isES6AsyncCommand = true;
  
        const context = {browser: this.client.api};
        vm.createContext(context);
        
        let result;
        try {
          const message = data.toString();
          Logger.log('Executed from browser : ', message);
          
          result = await vm.runInContext(message, context);
        } catch (err) {
          result = err;
        }

        if (isErrorObject(result)) {
          result = result.message;
        }

        ws.send(JSON.stringify(result));

        this.client.isES6AsyncCommand = isES6AsyncCommand;
        Debuggability.debugMode = false;
      });
    });
  }

  async createExtension () {
    const crxBuffer = await this.packExtension();
    this.addExtensionInChromeOption(crxBuffer);
  }

  loadContents () {
    return new Promise(function(resolve, reject) {
      const archive = archiver('zip');
      let contents = Buffer.from('');

      archive.on('error', reject);

      archive.on('data', function(buf) {
        contents = Buffer.concat([contents, buf]);
      });

      archive.on('finish', function() {
        resolve(contents);
      });

      const playgroundPath = path.join(__dirname, 'extension');

      archive
        .glob('**', {
          cwd: playgroundPath,
          matchBase: true,
          ignore: ['*.pem', '.git', '*.crx']
        })
        .finalize();
    });
  }

  async packExtension() {
    const packP = [
      this.loadContents()
    ];

    const outputs = await Promise.all(packP);
    const extension = outputs[0].toString('base64');

    return extension;
  }

  outputPreview(cmd, context) {
    if (cmd.includes('(')) {
      return;
    }

    const cmdArray = cmd.split('.');
    try {
      return Object.keys(context.browser).find(key => key.includes(cmdArray[1]));
    } catch (err) {
      return;
    }
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
