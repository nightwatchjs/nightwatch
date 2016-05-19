module.exports = {
  beforeEach : function(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  before : function(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  demoTestAsyncOne : function (client) {
    client.url('http://localhost');
  },

  demoTestAsyncTwo : function (client) {
    client.end();
  },

  afterEach : function(callback) {
    var client = this.client;
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  after : function(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  }
};