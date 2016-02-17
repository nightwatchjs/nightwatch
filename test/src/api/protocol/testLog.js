var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('session log commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testLog: function (done) {
    var protocol = this.protocol;

    var command = protocol.sessionLog('browser', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/log');
  },

  testLogTypes: function (done) {
    var protocol = this.protocol;

    var command = protocol.sessionLogTypes(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/log/types');
  }

});
