var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('cookie commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testCookieGet: function (done) {
    var protocol = this.protocol;

    var command = protocol.cookie('GET', function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
  },

  testCookiePost: function (done) {
    var protocol = this.protocol;

    var command = protocol.cookie('POST', {name: 'test_cookie'}, function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"cookie":{"name":"test_cookie"}}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
  },

  testCookieDeleteAll: function (done) {
    var protocol = this.protocol;

    var command = protocol.cookie('DELETE', function callback() {
      done();
    });

    assert.equal(command.request.method, 'DELETE');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie');
  },

  testCookieDeleteOne: function (done) {
    var protocol = this.protocol;

    var command = protocol.cookie('DELETE', 'test_cookie', function callback() {
      done();
    });

    assert.equal(command.request.method, 'DELETE');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/cookie/test_cookie');
  },

  testCookieErrors: function () {
    var protocol = this.protocol;

    assert.throws(
      function () {
        protocol.cookie('POST');
      }, 'POST method without a cookie param throws an error'
    );

    assert.throws(
      function () {
        protocol.window('PUT');
      }, 'PUT method throws an error'
    );

  }

});
