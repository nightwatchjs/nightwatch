var assert = require('assert');
var common = require('../../../common.js');
var MockServer  = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('client.source', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  'client.source() get command' : function(done) {
    var command = this.protocol.source(function() {});

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/source');

    command.on('result', function() {
      done();
    });
  },

  'client.source() get command callback' : function(done) {
    MockServer.addMock({
      url : "/wd/hub/session/1352110219202/source",
      response: "{\"name\":\"getPageSource\",\"sessionId\":\"1352110219202\",\"status\":0,\"value\":\"<!DOCTYPE html><html><head><title>NightwatchJS</title></head><body><div id='some_id'>some div content</div></body></html>\"}",
      statusCode : 200,
      method: "GET"
    });

    this.protocol.source(function(result) {
      assert.ok(true, 'Get callback called');
      assert.equal(result.status, 0);
      assert.equal(result.name, 'getPageSource');
      assert.ok(result.value.indexOf('<title>NightwatchJS</title>') > -1, 'Found <title> tag in response');
      assert.ok(true, 'GET source callback called');
      done();
    });
  }
});
