const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('session log commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testLog', function () {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/log');
      },
      commandName: 'sessionLog',
      args: []
    });
  });

  it('testLogTypes', function () {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/log/types');
      },
      commandName: 'sessionLogTypes',
      args: []
    });
  });

});
