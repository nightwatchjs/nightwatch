const {quit: Quit} = require('../../../api');

module.exports = class CustomQuit extends Quit {
  async command(callback, quitCallback) {
    let result;
    this.transport.once('session:finished', (reason) => {
      callback({
        client: this.client,
        reason,
        result
      });
    });

    result = await super.command(function(result) {
      return quitCallback(result);
    });
  }
};