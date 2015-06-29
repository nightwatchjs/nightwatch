module.exports = {
  before : function(client, callback) {
    client.globals.test.ok('before callback called.');
    callback();
  },

  beforeEach : function(client, callback) {
    client.globals.test.ok('beforeEach callback called.');
    callback();
  },

  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  },

  demoTest2 : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  },

  afterEach : function(client, callback) {
    client.globals.test.ok('afterEach callback called.');
    callback();
  },

  after : function(client, callback) {
    client.globals.test.ok('after callback called.');
    callback();
  }
};
