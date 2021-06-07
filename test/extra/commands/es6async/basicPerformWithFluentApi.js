module.exports = {
  async command(cb) {
    this.pause(10).perform(cb);
  }
};
