module.exports = {
  beforeEach : function(client, callback) {
    setTimeout(function() {
      client.globals.test.ok('beforeEach callback called.');
      callback();
    }, 100);
  },

  before : function(client, callback) {
    setTimeout(function() {
      client.globals.test.ok('before callback called.');
      callback();
    }, 100);
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
      client.globals.test.ok('afterEach callback called.');
      callback();
    }, 100);
  },

  after : function(client, callback) {
    setTimeout(function() {
      client.globals.test.ok('after callback called.');
      callback();
    }, 100);
  }
};