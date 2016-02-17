var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getLogTypes', {

  'client.getLogTypes()' : function(done) {
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

    client.getLogTypes(function callback(result) {
      assert.equal(Array.isArray(result), true);
      assert.equal(result.length, 2);
      assert.equal(result[0], 'browser');
      assert.equal(result[1], 'har');
      done();
    });

    Nightwatch.start();
  }
});
