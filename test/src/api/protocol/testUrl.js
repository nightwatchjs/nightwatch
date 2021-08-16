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
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, 'http://localhost');
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
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, null);
    });
  });

  it('client.url() get with callback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'url');
      },
      commandName: 'url',
      args: [function(result) {
        assert.strictEqual(result.value, 'http://localhost');
        assert.strictEqual(this.toString(), 'Nightwatch API');
      }]
    });
  });

  it('client.url() new with callback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'url');
      },
      commandName: 'url',
      args: ['http://localhost', function(result) {
        assert.strictEqual(result.value, null);
      }]
    });
  });
});
