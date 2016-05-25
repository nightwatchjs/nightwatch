var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getLocation', {

  'client.getLocation()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/location',
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

    client.getLocation('css selector', '#weblogin', function callback(result) {
      assert.deepEqual(result.value, {x : 1,y : 0});
    }).getLocation('#weblogin', function callback(result) {
      assert.deepEqual(result.value, {x : 1,y : 0});
      done();
    });

    Nightwatch.start();
  }
});
