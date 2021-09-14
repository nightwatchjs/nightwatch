const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('url', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('client.url() get', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'url');
      },
      commandName: 'url',
      args: []
    }).then((result) => {
      assert.strictEqual(result, 'http://localhost');
    });
  });

  it('client.url() new', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'url');
        assert.strictEqual(opts.url, 'http://localhost');
      },
      commandName: 'url',
      args: ['http://localhost']
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

});
