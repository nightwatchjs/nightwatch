var assert = require('assert');
var common = require('../../../common.js');
var MockServer = require('../../../lib/mockserver.js');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('alert commands', {
  beforeEach: function () {
    this.client = Nightwatch.client();
    this.protocol = common.require('api/protocol.js')(this.client);
  },

  testAcceptAlert: function (done) {
    var client = this.client;
    var protocol = this.protocol;

    var command = protocol.acceptAlert(function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/accept_alert');
  },

  testDismissAlert: function (done) {
    var protocol = this.protocol;

    var command = protocol.dismissAlert(function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/dismiss_alert');
  },

  testGetAlertText: function (done) {
    var protocol = this.protocol;

    var command = protocol.getAlertText(function callback() {
      done();
    });

    assert.equal(command.request.method, 'GET');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/alert_text');
  },

  testSetAlertText: function (done) {
    var protocol = this.protocol;

    var command = protocol.setAlertText('prompt text to set', function callback() {
      done();
    });

    assert.equal(command.request.method, 'POST');
    assert.equal(command.data, '{"text":"prompt text to set"}');
    assert.equal(command.request.path, '/wd/hub/session/1352110219202/alert_text');
  }

});
