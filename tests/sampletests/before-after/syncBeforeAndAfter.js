module.exports = {
  beforeEach : function(client) {
    client.globals.test.ok('beforeEach callback called.');
  },

  before : function(client) {
    client.globals.test.ok('before callback called.');
  },

  demoTestAsyncOne : function (client) {
    client.url('http://localhost');
  },

  demoTestAsyncTwo : function (client) {
    client.end();
  },

  afterEach : function() {
    var client = this.client;
    client.globals.test.ok('afterEach callback called.');
  },

  after : function(client) {
    client.globals.test.ok('after callback called.');
  }
};