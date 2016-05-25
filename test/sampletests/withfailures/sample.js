module.exports = {
  before : function(client, callback) {
    client.globals.calls++;
    callback();
  },

  beforeEach : function(client, callback) {
    client.globals.calls++;
    callback();
  },

  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .assert.elementPresent('#webLogin')
      .end();
  },

  demoTest2 : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  },

  afterEach : function(client, callback) {
    client.globals.calls++;
    callback();
  },

  after : function(client, callback) {
    client.globals.calls++;
    callback();
  }
};
