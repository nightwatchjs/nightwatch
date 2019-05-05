module.exports = class {
  async command(cb) {
    this.api.pause(10);
    this.api.globals.logResult = await this.api.getLog('browser');

    await this.api.perform(cb);
  }
};
