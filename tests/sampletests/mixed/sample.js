module.exports = {
  demoTestMixed : function (client) {
    client.url('http://localhost').end();
  },

  tearDown : function(callback) {
    var client = this.client;
    var self = this;
    setTimeout(function() {
      client.globals.test.ok('tearDown callback called.');
      client.globals.test.deepEqual(self.results, {
        passed: 0, failed: 0, errors: 0, skipped: 0, tests: []
      });
      client.globals.test.deepEqual(self.errors, []);
      callback();
    }, 100);
  }
};