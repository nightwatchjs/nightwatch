module.exports = {
  '@unitTest': true,
  demoSync() {
    this.client.globals.calls++;
  },

  demoTestAsync(done) {
    this.client.globals.calls++;
    setTimeout(function () {
      done();
    }, 10);
  }
};
