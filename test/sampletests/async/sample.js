var assert = require('assert');

module.exports = {
  setUp : function(client, callback) {
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  },

  demoTestAsync : function (client) {
    client.url('http://localhost').end();
  },

  tearDown : function(callback) {
    var client = this.client;
    setTimeout(function() {
      client.globals.calls++;
      callback();
    }, 10);
  }
};