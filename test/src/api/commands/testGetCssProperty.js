var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getCssProperty', {

  'client.getCssProperty()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/css/display',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'block'
      })
    });

    client.getCssProperty('#weblogin', 'display', function callback(result) {
      assert.equal(result.value, 'block');
      done();
    });

    Nightwatch.start();
  }
});
