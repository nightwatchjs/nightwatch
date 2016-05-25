var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('window commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testWindowHandle: function (done) {
    var protocol = this.protocol;

    var command = protocol.windowHandle(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window_handle');
  },

  testWindowHandlePlural: function (done) {
    var protocol = this.protocol;

    var command = protocol.windowHandles(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window_handles');
  },

  testCloseWindow: function (done) {
    var protocol = this.protocol;

    var command = protocol.window('DELETE', function callback() {
      done();
    });

    assert.equal(command.request.method, 'DELETE');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window');
  },

  testSwitchWindow: function (done) {
    var protocol = this.protocol;

    var command = protocol.window('POST', 'other-window', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"name":"other-window"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/window');
  },

  testWindowCommand: function () {
    var protocol = this.protocol;

    assert.throws(
      function () {
        protocol.window('POST');
      }, 'POST method without a name param throws an error'
    );

    assert.throws(
      function () {
        protocol.window('GET');
      }, 'GET method throws an error'
    );

  }

});
