const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.title', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testTitle', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/title');
      },
      commandName: 'title',
      args: []
    });
  });

});
