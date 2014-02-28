module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    callback();
  },

  'Test initialization' : function(test) {
    var self = this;

    this.client.on('selenium:session_create', function(sessionId) {
      test.equal(self.client.sessionId, 1352110219202, 'Testing if session ID was set correctly');
      test.done();
    });
  },

  'Test runProtocolCommand without error' : function(test) {
    var client = this.client;
    this.client.on('selenium:session_create', function(sessionId) {
      var request = client.runProtocolAction({
        host : '127.0.0.1',
        path : '/test',
        port : 10195
      });

      test.ok('send' in request);

      request.on('result', function(result, response) {
        test.equal(result.status, 0);
        test.done();
      }).on('complete', function() {
      }).on('error', function() {
      }).send();
    });
  },

  'Test runProtocolAction with error' : function(test) {
    var client = this.client;

    this.client.saveScreenshotToFile = function() {};
    this.client.options.screenshots.enabled = true;

    this.client.on('selenium:session_create', function(sessionId) {
      var request = client.runProtocolAction({
        host : '127.0.0.1',
        path : '/test_error',
        port : 10195
      });

      request.on('result', function(result) {
        test.equal(result.status, -1);
        test.equal(result.errorStatus, 7);
        test.equal(result.value.screen, undefined);
        test.equal(result.error, 'An element could not be located on the page using the given search parameters.');
        test.done();
      })
      .send();
    });
  },

  testRunCommand : function(test) {
    var client = this.client;
    client.enqueueCommand('url', ['http://localhost'], function(result) {
      test.ok(true, 'Callback 1 was called');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client.queue.reset();
    this.client = null;
    // clean up
    callback();
  }
};
