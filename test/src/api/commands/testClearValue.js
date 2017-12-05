var MockServer  = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('clearValue', {
  'client.clearValue()': function (done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });

    client.clearValue('#webdriver', function callback(result) {
        assert.equal(result.status, 0);
      })
      .clearValue('css selector', '#webdriver', function callback(result) {
        assert.equal(result.status, 0);
        done();
      });

    Nightwatch.start();
  }
});
