var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getAttribute', {

  'client.getAttribute()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/attribute/class',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'test_class'
      })
    });

    client.getAttribute('#weblogin', 'class', function callback(result) {
      assert.equal(result.value, 'test_class');
    }).getAttribute('css selector', '#weblogin', 'class', function callback(result) {
      assert.equal(result.value, 'test_class');
      done();
    });

    Nightwatch.start();
  }
});
