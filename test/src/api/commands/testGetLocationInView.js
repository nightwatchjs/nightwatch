var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getLocationInView', {

  'client.getLocationInView()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/location_in_view',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : {
          x : 1,
          y : 0
        }
      })
    });

    client.getLocationInView('css selector', '#weblogin', function callback(result) {
      assert.deepEqual(result.value, {x : 1,y : 0});
    }).getLocationInView('#weblogin', function callback(result) {
      assert.deepEqual(result.value, {x : 1,y : 0});
      done();
    });

    Nightwatch.start();
  }
});
