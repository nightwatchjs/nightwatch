var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('windowPosition', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testWindowPositionGet: function (done) {
    var protocol = this.protocol;

    var command = protocol.windowPosition('current', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/position');
  },

  testWindowPositionPost: function (done) {
    var protocol = this.protocol;

    var command = protocol.windowPosition('current', 10, 10, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"x":10,"y":10}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/position');
  },

  testWindowPositionErrors: function () {
    var protocol = this.protocol;

    assert.throws(
      function () {
        protocol.windowPosition(function () {
        });
      }, 'First argument must be a window handle string.'
    );

    assert.throws(
      function () {
        protocol.windowPosition('current', 'a', 10);
      }, 'Offset arguments must be passed as numbers.'
    );

    assert.throws(
      function () {
        protocol.windowPosition('current', 10);
      }, 'Offset arguments must be passed as numbers.'
    );

    assert.throws(
      function () {
        protocol.windowPosition('current', 10, 'a');
      }, 'Offset arguments must be passed as numbers.'
    );
  }

});
