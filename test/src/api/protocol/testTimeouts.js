var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('timeouts commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testTimeoutsValid: function (done) {
    var protocol = this.protocol;

    var command = protocol.timeouts('script', 1000, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"type":"script","ms":1000}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts');
  },

  testTimeoutsInvalid: function () {
    var protocol = this.protocol;

    assert.throws(
      function () {
        protocol.timeouts('nonscript', 1000);
      }
    );

    assert.throws(
      function () {
        protocol.timeouts('script');
      }
    );
  },

  testTimeoutsAsyncScript: function (done) {
    var protocol = this.protocol;

    var command = protocol.timeoutsAsyncScript(1000, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"ms":1000}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts/async_script');
  },

  testTimeoutsImplicitWait: function (done) {
    var protocol = this.protocol;

    var command = protocol.timeoutsImplicitWait(1000, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"ms":1000}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/timeouts/implicit_wait');
  }

});
