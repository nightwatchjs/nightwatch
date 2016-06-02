var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('context commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testContexts: function (done) {
    var protocol = this.protocol;

    var command = protocol.contexts(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/contexts');
  },

  testCurrentContext: function (done) {
    var protocol = this.protocol;

    var command = protocol.currentContext(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/context');
  },

  testSetContext: function (done) {
    var protocol = this.protocol;

    var command = protocol.setContext('NATIVE', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"name":"NATIVE"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/context');
  }
});
