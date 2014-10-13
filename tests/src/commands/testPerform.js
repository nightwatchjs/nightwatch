module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var self = this;
    this.client.api.perform(function(client) {
      test.deepEqual(self.client.api, client);
      test.done();
    });
  },

  testCommandAsyc : function(test) {
    var self = this;
    this.client.api.perform(function(client, done) {
      test.deepEqual(self.client.api, client);
      test.ok(typeof done == 'function');

      process.nextTick(function() {
        done();
        test.done();
      });

    });
  },

  tearDown : function(callback) {
    this.client = null;

    callback();
  }
};
