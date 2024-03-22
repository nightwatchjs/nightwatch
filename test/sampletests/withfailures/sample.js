module.exports = {
  before(client, callback) {
    client.globals.calls++;
    callback();
  },

  beforeEach(client, callback) {
    client.globals.calls++;
    callback();
  },

  demoTest(client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .assert.elementPresent('#webLogin')
      .end();
  },

  demoTest2(client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  },

  afterEach(client, callback) {
    client.globals.calls++;
    callback();
  },

  after(client, callback) {
    client.globals.calls++;
    callback();
  }
};
