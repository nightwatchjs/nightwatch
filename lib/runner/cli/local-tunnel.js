const util = require('util');
const BStackLocal = require('browserstack-local').Local;
const Utils = require('../../utils');
const {Logger} = Utils;

class LocalTunnel {
  constructor(settings = {}) {
    this.settings = settings;
    this.tunnel = this.settings.tunnel;
    this.opts = this.tunnel ? this.tunnel.options : {};
    this.key = this.opts.key;
    if(this.tunnel && this.tunnel.type) {
      switch(this.tunnel.type) {
        case 'browserstack':
          this.localTunnel = new BStackLocal();
      }
    }
  }

  async start() {
    if (this.localTunnel && this.key) {
      try {
        await util.promisify(this.localTunnel.start.bind(this.localTunnel))({ key: this.key, ...this.opts });
        this.localStarted = true;
        this.settings.browserstackLocal = {
          localIdentifier: this.opts.localIdentifier
        }
      } catch (err) {
        Logger.error("Starting of local failed", err);
      }
    }
  }

  async stop() {
    try {
      this.localStarted && await util.promisify(this.localTunnel.stop.bind(this.localTunnel))();
    } catch (err) {
      Logger.error("Stopping of local failed", err);
    }
  }
};

module.exports = LocalTunnel;
