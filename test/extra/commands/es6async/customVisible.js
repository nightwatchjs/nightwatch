module.exports = class customVisible {
  async command(selector) {
    await this.api.assert.visible(selector);
  }
};