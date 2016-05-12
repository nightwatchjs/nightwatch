var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('moveToElement', {

  'client.moveToElement()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/moveto',
      method:'POST',
      postdata: '{"element":"0"}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });

    client.moveTo('css selector', '#weblogin', null, null, function callback(result) {
      assert.equal(result.status, 0);
    }).moveToElement('#weblogin', null, null, function callback(result) {
      assert.equal(result.status, 0);
      done();
    });

    Nightwatch.start();
  }
});
