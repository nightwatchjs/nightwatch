const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const MockServer = require('../../../lib/mockserver.js');

describe('client.source', function() {
  before(function(done) {
    Globals.protocolBefore.call(this);

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
    let runAction = this.client.transport.runProtocolAction;

    return Globals.protocolTest.call(this, {
      assertion: opts => {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/source');

        this.client.transport.runProtocolAction = runAction;
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

    Globals.runApiCommand(null, 'source', [function(result) {
      try {
        assert.equal(result.status, 0);
        assert.equal(result.name, 'getPageSource');
        assert.ok(result.value.indexOf('<title>NightwatchJS</title>') > -1, 'Found <title> tag in response');
        assert.ok(true, 'GET source callback called');
        done();
      } catch (err) {
        done(err);
      }
    }]);

  });
});
