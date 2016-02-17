var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getTagName', {

  'client.getTagName()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/name',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'div'
      })
    });

    client.getTagName('css selector', '#weblogin', function callback(result) {
      assert.equal(result.value, 'div');
    }).getTagName('#weblogin', function callback(result) {
      assert.equal(result.value, 'div');
      done();
    });

    Nightwatch.start();
  }
});
