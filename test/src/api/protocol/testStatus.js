const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.status', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testStatus', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/status');
      },
      commandName: 'status',
      args: []
    });
  });

});
