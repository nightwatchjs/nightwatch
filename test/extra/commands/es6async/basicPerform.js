module.exports = {
  command(cb) {
    this.pause(10).perform(cb);
  }
};
