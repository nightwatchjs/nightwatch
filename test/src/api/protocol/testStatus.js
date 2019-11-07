const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.status', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testStatus', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/status');
      },
      commandName: 'status',
      args: []
    });
  });

});
