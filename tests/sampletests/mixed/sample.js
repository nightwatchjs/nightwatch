module.exports = {
  demoTestMixed : function (client) {
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