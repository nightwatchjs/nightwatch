module.exports = {
  before(client) {
    client.globals.calls++;
  },

  demoTest(client) {
    client.url('http://localhost')
      .verify.equal(0, 1, 'custom message')
      .verify.elementPresent('#badElement')
      .verify.elementPresent('#weblogin')
      .end();
  },

  after(client, callback) {
    client.globals.calls++;
    callback();
  }
};
