var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('windowSize', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testWindowSizeErrors: function () {
    var protocol = this.protocol;

    assert.throws(
      function () {
        protocol.windowSize(function () {
        });
      }, 'First argument must be a window handle string.'
    );

    assert.throws(
      function () {
        protocol.windowSize('current', 'a', 10);
      }, 'Width and height arguments must be passed as numbers.'
    );

    assert.throws(
      function () {
        protocol.windowSize('current', 10);
      }, 'Width and height arguments must be passed as numbers.'
    );

    assert.throws(
      function () {
        protocol.windowSize('current', 10, 'a');
      }, 'Width and height arguments must be passed as numbers.'
    );
  },

  testWindowSizeGet: function (done) {
    var protocol = this.protocol;

    var command = protocol.windowSize('current', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
  },

  testWindowSizePost: function (done) {
    var protocol = this.protocol;

    var command = protocol.windowSize('current', 10, 10, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"width":10,"height":10}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window/current/size');
  }

});
