module.exports = {
  before : function(client, callback) {
    client.perform(function() {
      client.globals.test.ok('before callback called.');
      callback();
    });
  },

  beforeEach : function(client, callback) {
    client.perform(function() {
      setTimeout(function() {
        client.globals.test.ok('beforeEach callback called.');
        callback();
      }, 10);
    });
  },

  demoTest : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  demoTest2 : function (client) {
    client.url('http://localhost')
      .assert.elementPresent('#weblogin')
      .end();
  },

  afterEach : function(client, callback) {
    client.perform(function() {
      setTimeout(function() {
        client.globals.test.ok('afterEach callback called.');
        callback();
      }, 10);
    });
  },

  after : function(client, callback) {
    client
      .customPerform(function() {
        client.globals.test.ok('customPerform callback called.');
      })
      .perform(function() {
        setTimeout(function() {
          client.globals.test.ok('after callback called.');
          callback();
        }, 10);
      });
  }
};
