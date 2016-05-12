var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('maximizeWindow', {

  'client.maximizeWindow()' : function(done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/window/current/maximize',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);

    client.maximizeWindow(function callback(result) {
      assert.strictEqual(result.status, 0);
      done();
    });

    Nightwatch.start();
  }
});
