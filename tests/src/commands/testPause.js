module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    this.client.api.pause(200, function() {
      test.done();
    });

  },

  tearDown : function(callback) {
    this.client = null;

    callback();
  }
};
