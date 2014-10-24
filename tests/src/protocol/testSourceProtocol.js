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
      var command = protocol.source(function() {});

      test.equal(command.request.method, 'GET');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/source');

      command.on('result', function() {
        test.done();
      });
    });
  },

  testCommandCallback : function(test) {
    var client = this.client;
    var protocol = this.protocol;

    this.client.on('selenium:session_create', function(sessionId) {
      protocol.source(function() {
        test.ok(true, 'Get callback called');
      });

      protocol.source(function(result) {

        test.equal(result.status, 0);
        test.equal(result.name, 'getPageSource');
        test.ok(result.value.indexOf('<title>NightwatchJS</title>') > -1,
                'Found <title> tag in response');

        test.ok(true, 'GET source callback called');
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
