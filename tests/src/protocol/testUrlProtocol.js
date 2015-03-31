module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    this.protocol = require('../../../lib/api/protocol.js')(this.client);
    callback();
  },

  testGetCommand : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.url(function() {});

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/url');
      command.on('result', function() {
        test.done();
      });
    });
  },

  testPostCommand : function(test) {
    var client = this.client;
    var protocol = this.protocol;
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.url('http://localhost');

      test.equal(command.request.method, 'POST');
      test.equal(command.data, '{"url":"http://localhost"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/url');
      command.on('result', function() {
        test.done();
      });
    });
  },

  testCommandCallback : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      protocol.url(function() {
        test.ok(true, 'Get callback called');
      });

      protocol.url('http://localhost', function() {
        test.ok(true, 'Post callback called');
        test.done();
      });
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
