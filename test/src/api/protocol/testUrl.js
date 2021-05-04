const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('url', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('client.url() get', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/url');
      },
      commandName: 'url',
      args: []
    });
  });

  it('client.url() new', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/url');
        assert.deepStrictEqual(opts.data, {url: 'http://localhost'});
      },
      commandName: 'url',
      args: ['http://localhost']
    });
  });

  it('client.url() get with callback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/url');
      },
      commandName: 'url',
      args: [function() {
        assert.strictEqual(this.toString(), 'Nightwatch API');
      }]
    });
  });

  it('client.url() new with callback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/url');
        assert.deepStrictEqual(opts.data, {url: 'http://localhost'});
      },
      commandName: 'url',
      args: ['http://localhost', function() {

      }]
    });
  });
});
