module.exports = {
  before(client) {
    client.globals.calls++;
  },
  
  demoTest(client) {
    client.url('http://localhost')
      .waitForElementNotPresent('#badElement')
      .waitForElementNotPresent('#weblogin')
      .end();
  },

  after(client, callback) {
    client.globals.calls++;
    callback();
  }
};
  