module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  testCloseWindow : function(test) {
    var client = this.client.api;
    client.closeWindow(function callback() {
      test.done();
    });
  },

  testSwitchWindow : function(test) {
    var client = this.client.api;
    client.closeWindow(function callback() {
      test.done();
    });
  },

  testResizeWindow : function(test) {
    var client = this.client.api;
    client.resizeWindow(100, 100, function callback() {
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
