var assert = require('assert');
var common = require('../../../common.js');
var MockServer  = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('orientation commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testGetOrientation: function (done) {
    var protocol = this.protocol;

    var command = protocol.getOrientation(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/orientation');
  },

  testSetOrientation: function (done) {
    var protocol = this.protocol;

    var command = protocol.setOrientation('LANDSCAPE',function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"orientation":"LANDSCAPE"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/orientation');
  },

  testSetOrientationInvalid: function () {
    var protocol = this.protocol;

    assert.throws(function() {
      protocol.setOrientation('TEST');
    });
  }
});
