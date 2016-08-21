var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('isLogAvailable', {
  afterEach : function() {
    MockServer.removeMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method: 'GET'
    });
  },

  'client.isLogAvailable()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : [ 'browser', 'har' ]
      })
    });

    client.isLogAvailable( 'unknown', function callback(result) {
        assert.equal(typeof result === 'boolean', true);
        assert.equal(result, false);
      })
      .isLogAvailable( 'browser', function callback(result) {
        assert.equal(typeof result === 'boolean', true);
        assert.equal(result, true);
        done();
      });

    Nightwatch.start();
  },

  'client.isLogAvailable() failure' : function(done) {
    var client = Nightwatch.api();

     MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : { 'message': 'Session not started or terminated' }
      })
    });

    client.isLogAvailable( 'unknown', function callback(result) {
      assert.equal(typeof result === 'boolean', true);
      assert.equal(result, false);
    })
    .isLogAvailable( 'browser', function callback(result) {
      assert.equal(typeof result === 'boolean', true);
      assert.equal(result, false);
      done();
    });

    Nightwatch.start();
  }
});