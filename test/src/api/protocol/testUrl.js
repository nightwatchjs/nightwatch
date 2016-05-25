var assert = require('assert');
var common = require('../../../common.js');
var MockServer  = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('url', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  'client.url() get' : function(done) {
    var protocol = this.protocol;
    var command = protocol.url(function() {});

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/url');
    command.on('result', function() {
      done();
    });

  },

  'client.url() new' : function(done) {
    var protocol = this.protocol;
    var command = protocol.url('http://localhost');

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"url":"http://localhost"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/url');
    command.on('result', function() {
      done();
    });
  },

  'client.url() get with callback' : function(done) {
    var protocol = this.protocol;

    protocol.url(function() {
      assert.ok(true, 'Get callback called');
    });

    protocol.url('http://localhost', function() {
      assert.ok(true, 'Post callback called');
      done();
    });
  }
});
