const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.status', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testStatus', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/status');
      },
      commandName: 'status',
      args: []
    });
  });

});
