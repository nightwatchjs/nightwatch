module.exports = {
  setUp : function(client, callback) {
    setTimeout(function() {
      client.globals.test.ok('setUp callback called.');
      callback();
    }, 100);
  },

  demoTestAsync : function (client) {
    client.url('http://localhost').end();
  },

  tearDown : function(callback) {
    var client = this.client;
    setTimeout(function() {
      client.globals.test.ok('tearDown callback called.');
      callback();
    }, 100);
  }
};