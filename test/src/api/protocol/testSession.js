var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('session commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testSessions: function (done) {
    var protocol = this.protocol;

    var command = protocol.sessions(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/sessions');
  },

  testSessionDefault: function (done) {
    var protocol = this.protocol;


    var command = protocol.session(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202');
  },

  testSessionGETImplicit: function (done) {
    var protocol = this.protocol;

    var command = protocol.session(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202');
  },

  testSessionGETExplicit: function (done) {
    var protocol = this.protocol;

    var command = protocol.session('GET', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202');
  },

  testSessionGETImplicitById: function (done) {
    var protocol = this.protocol;

    var command = protocol.session('1352110219203', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219203');
  },

  testSessionGETExplicitById: function (done) {
    var protocol = this.protocol;

    var command = protocol.session('GET', '1352110219203', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219203');
  },

  testSessionDELETE: function (done) {
    var protocol = this.protocol;

    var command = protocol.session('DELETE', function callback() {
      done();
    });

    assert.equal(command.request.method, 'DELETE');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202');
  },

  testSessionDELETEById: function (done) {
    var protocol = this.protocol;

    var command = protocol.session('DELETE', '1352110219203', function callback() {
      done();
    });

    assert.equal(command.request.method, 'DELETE');
    assert.equal(command.request.path, '/wd/hub/session/1352110219203');
  },

  testSessionPOST: function (done) {
    var protocol = this.protocol;

    var command = protocol.session('POST', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session');
  }

});
