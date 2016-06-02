var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('submitForm', {

  'client.submitForm()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/submit',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client.submitForm('#weblogin', function callback(result) {
      assert.equal(result.status, 0);
    }).submitForm('css selector', '#weblogin', function callback(result) {
      assert.equal(result.status, 0);
      done();
    });

    Nightwatch.start();
  }
});
