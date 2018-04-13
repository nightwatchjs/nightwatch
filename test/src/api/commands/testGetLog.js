const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('getLog', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getLog()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/log',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [
          {'level': 'info', 'timestamp': 534547832, 'message': 'Test log'},
          {'level': 'info', 'timestamp': 534547442, 'message': 'Test log2'}
        ]
      })
    }, true);

    this.client.api.getLog('browser', function(result) {
      assert.equal(Array.isArray(result), true, 'result is array');
      assert.equal(result.length, 2);
      assert.equal(result[0].message, 'Test log');
      assert.equal(result[1].message, 'Test log2');
    });

    this.client.start(done);
  });
});
