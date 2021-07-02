const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const MockServer = require('../../../lib/mockserver.js');

xdescribe('client.source', function() {
  before(function(done) {
    Globals.protocolBefore();
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('client.source() get command', function() {
    return Globals.protocolTest({
      assertion: opts => {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/source');
      },
      commandName: 'source',
      args: []
    });
  });

  it('client.source() get command callback', function(done) {
    MockServer.addMock({
      url: '/session/1352110219202/source',
      response: '{"name":"getPageSource","sessionId":"1352110219202","status":0,"value":"<!DOCTYPE html><html><head><title>NightwatchJS</title></head><body><div id=\'some_id\'>some div content</div></body></html>"}',
      statusCode: 200,
      method: 'GET'
    });

    Globals.runApiCommand('source', [function(result) {
      try {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(result.name, 'getPageSource');
        assert.ok(result.value.indexOf('<title>NightwatchJS</title>') > -1, 'Found <title> tag in response');
        assert.ok(true, 'GET source callback called');
        done();
      } catch (err) {
        done(err);
      }
    }]);

  });
});
