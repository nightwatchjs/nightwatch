const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('isLogAvailable', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function() {
    MockServer.removeMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method: 'GET'
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.isLogAvailable()', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : [ 'browser', 'har' ]
      })
    });

    this.client.api
      .isLogAvailable('unknown', function callback(result) {
        assert.equal(typeof result === 'boolean', true);
        assert.equal(result, false);
      })
      .isLogAvailable('browser', function callback(result) {
        assert.equal(typeof result === 'boolean', true);
        assert.equal(result, true);
      });

    this.client.start(done);
  });

  it('client.isLogAvailable() failure', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : { 'message': 'Session not started or terminated' }
      })
    });

    this.client.api.isLogAvailable( 'unknown', function callback(result) {
      assert.equal(typeof result === 'boolean', true);
      assert.equal(result, false);
    })
      .isLogAvailable( 'browser', function callback(result) {
        assert.equal(typeof result === 'boolean', true);
        assert.equal(result, false);
      });

    this.client.start(done);
  });
});
