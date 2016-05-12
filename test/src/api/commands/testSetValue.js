var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('setValue', {

  'client.setValue()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/value',
      method:'POST',
      postdata : '{"value":["1"]}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client.setValue('css selector', '#weblogin', '1', function callback(result) {
      assert.equal(result.status, 0);
    }).setValue('#weblogin', '1', function callback(result) {
      assert.equal(result.status, 0);
      done();
    });

    Nightwatch.start();
  }
});
