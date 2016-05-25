var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('clearValue', {
  'client.clearValue()': function (done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/clear',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });

    client.clearValue('#weblogin', function callback(result) {
        assert.equal(result.status, 0);
      })
      .clearValue('css selector', '#weblogin', function callback(result) {
        assert.equal(result.status, 0);
        done();
      });

    Nightwatch.start();
  }
});
