var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getText', {

  'client.getText()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/text',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'sample text'
      })
    });

    client.getText('css selector', '#weblogin', function callback(result) {
      assert.equal(result.value, 'sample text');
    }).getText('#weblogin', function callback(result) {
      assert.equal(result.value, 'sample text');
      done();
    });

    Nightwatch.start();
  }
});