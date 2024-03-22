module.exports = {
  before(client) {
    client.globals.calls++;
    client.url('http://localhost');
  },

  demoTest(client) {
    client.verify.equal(0, 1, 'custom message')
      .verify.elementPresent('#weblogin')
      .verify.elementPresent('#badElement');
  },

  demoTest1(client) {
    client.verify.equal(0, 0, 'custom message');
  },

  after(client, callback) {
    client.end();
    client.globals.calls++;
    callback();
  }
};
