const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('context commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testContexts', function() {

    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/contexts');
      },
      commandName: 'contexts',
      args: []
    });
  });

  it('testCurrentContext', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/context');
      },
      commandName: 'currentContext',
      args: []
    });
  });

  it('testSetContext', function() {
    let text = 'NATIVE';
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/context');
        assert.deepEqual(opts.data, {'name': text});
      },
      commandName: 'setContext',
      args: [text]
    });
  });
});
