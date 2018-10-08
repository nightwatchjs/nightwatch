module.exports = {
  before : function(client, callback) {
    console.log('before', client.globals.calls)
    client.globals.calls++;
    callback();
  },

  beforeEach : function(client, callback) {
    console.log('beforeEach', client.globals.calls)
    client.globals.calls++;
    callback();
  },

  demoTest : function (client) {
    console.log('demoTest')
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .assert.elementPresent('#webLogin')
      .end();
  },

  demoTest2 : function (client) {
    console.log('demoTest2')
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .assert.elementPresent('#badElement')
      .end();
  },

  afterEach : function(client, callback) {
    console.log('afterEach', client.globals.calls)
    client.globals.calls++;
    callback();
  },

  after : function(client, callback) {
    console.log('after', client.globals.calls)
    client.globals.calls++;
    callback();
  }
};
