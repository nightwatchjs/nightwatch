module.exports = {
  async command(cb) {
    // intentional misuse which will cause an error
    this.pause(10).perform(cb);
  }
};
