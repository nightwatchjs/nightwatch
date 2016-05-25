var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getLog', {
  'client.getLog()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : [ { 'level': 'info', 'timestamp': 534547832, 'message': 'Test log' }, { 'level': 'info', 'timestamp': 534547442, 'message': 'Test log2' } ]
      })
    }, true);

    client.getLog('browser', function(result) {
      assert.equal(Array.isArray(result), true, 'result is array');
      assert.equal(result.length, 2);
      assert.equal(result[0].message, 'Test log');
      assert.equal(result[1].message, 'Test log2');
      done();
    });

    Nightwatch.start();
  }
});
