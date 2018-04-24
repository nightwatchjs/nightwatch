const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('alert commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testAcceptAlert', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/accept_alert');
      },
      commandName: 'acceptAlert',
      args: []
    });
  });

  it('testDismissAlert', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/dismiss_alert');
      },
      commandName: 'dismissAlert',
      args: []
    });
  });

  it('testGetAlertText', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/alert_text');
      },
      commandName: 'getAlertText',
      args: []
    });
  });

  it('testSetAlertText', function() {
    let text = 'prompt text to set';
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/alert_text');
        assert.deepEqual(opts.data, {text: text});
      },
      commandName: 'setAlertText',
      args: [text]
    });
  });

});
