const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.doubleClick', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testDoubleClick', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/doubleclick');
      },
      commandName: 'doubleClick',
      args: []
    });
  });

});
