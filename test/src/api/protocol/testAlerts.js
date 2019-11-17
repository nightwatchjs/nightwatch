const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('alert commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testAcceptAlert', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/accept_alert');
      },
      commandName: 'acceptAlert',
      args: []
    });
  });

  it('testAcceptAlert W3C WebDriver', function () {
    return Globals.protocolTestWebdriver({
      assertion: function (opts) {
        assert.equal(opts.path, '/session/1352110219202/alert/accept');
      },
      commandName: 'acceptAlert',
      args: []
    });
  });


  it('testDismissAlert', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/dismiss_alert');
      },
      commandName: 'dismissAlert',
      args: []
    });
  });

  it('testDismissAlert W3C WebDriver', function () {
    return Globals.protocolTestWebdriver({
      assertion: function (opts) {
        assert.equal(opts.path, '/session/1352110219202/alert/dismiss');
      },
      commandName: 'dismissAlert',
      args: []
    });
  });

  it('testGetAlertText', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/alert_text');
      },
      commandName: 'getAlertText',
      args: []
    });
  });

  it('testGetAlertText W3C WebDriver', function () {
    return Globals.protocolTestWebdriver({
      assertion: function (opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/alert/text');
      },
      commandName: 'getAlertText',
      args: []
    });
  });

  it('testSetAlertText', function () {
    let text = 'prompt text to set';
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/alert_text');
        assert.deepEqual(opts.data, {text: text});
      },
      commandName: 'setAlertText',
      args: [text]
    });
  });

  it('testSetAlertText W3C WebDriver', function () {
    let text = 'prompt text to set';
    return Globals.protocolTestWebdriver({
      assertion: function (opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/alert/text');
        assert.deepEqual(opts.data, {text: text});
      },
      commandName: 'setAlertText',
      args: [text]
    });
  });
});
