module.exports = {
  async command(cb) {
    this.pause(10);

    await this.perform(cb);
  }
};
