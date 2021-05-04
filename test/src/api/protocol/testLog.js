const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('session log commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testLog', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/log');
      },
      commandName: 'sessionLog',
      args: []
    });
  });

  it('testLogTypes', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/log/types');
      },
      commandName: 'sessionLogTypes',
      args: []
    });
  });

});
