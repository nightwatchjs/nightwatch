var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getValue', {

  'client.getValue()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/attribute/value',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'test value'
      })
    });

    client.getValue('css selector', '#weblogin', function callback(result) {
      assert.equal(result.value, 'test value');
    }).getValue('#weblogin', function callback(result) {
      assert.equal(result.value, 'test value');
      done();
    });

    Nightwatch.start();
  }
});
