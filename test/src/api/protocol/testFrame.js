var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('client.frame', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testFrameDefault: function (done) {
    var protocol = this.protocol;

    var command = protocol.frame(function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
  },

  testFramePost: function (done) {
    var protocol = this.protocol;

    var command = protocol.frame('testFrame', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"id":"testFrame"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/frame');
  },

  testFrameParent: function (done) {
    var protocol = this.protocol;

    var command = protocol.frameParent(function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/frame/parent');
  }
});
