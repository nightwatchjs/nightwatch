const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.title', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testTitle', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/title');
      },
      commandName: 'title',
      args: []
    });
  });

});
