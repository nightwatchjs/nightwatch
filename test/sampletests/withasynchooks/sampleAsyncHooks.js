module.exports = {
  before : function(client, callback) {
    client.perform(function() {
      client.globals.calls++;
      callback();
    });
  },

  beforeEach : function(client, callback) {
    client.perform(function() {
      setTimeout(function() {
        client.globals.calls++;
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
        client.globals.calls++;
        callback();
      }, 10);
    });
  },

  after : function(client, callback) {
    client
      .customPerform(function() {
        client.globals.calls++;
      })
      .perform(function() {
        setTimeout(function() {
          client.globals.calls++;
          callback();
        }, 10);
      });
  }
};
