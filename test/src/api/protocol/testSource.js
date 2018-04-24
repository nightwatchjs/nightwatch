const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const MockServer = require('../../../lib/mockserver.js');

describe('client.source', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('client.source() get command', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/source');
      },
      commandName: 'source',
      args: []
    });
  });

  it('client.source() get command callback', function(done) {
    MockServer.addMock({
      url: "/wd/hub/session/1352110219202/source",
      response: "{\"name\":\"getPageSource\",\"sessionId\":\"1352110219202\",\"status\":0,\"value\":\"<!DOCTYPE html><html><head><title>NightwatchJS</title></head><body><div id='some_id'>some div content</div></body></html>\"}",
      statusCode: 200,
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
  });
});
