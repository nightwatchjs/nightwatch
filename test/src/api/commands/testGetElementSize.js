var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getElementSize', {

  'client.getElementSize()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/size',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value :100
      })
    });

    client.getElementSize('#weblogin', function callback(result) {
      assert.equal(result.value, 100);
    }).getElementSize('css selector', '#weblogin', function callback(result) {
      assert.equal(result.value, 100);
      done();
    });

    Nightwatch.start();
  }
}
);