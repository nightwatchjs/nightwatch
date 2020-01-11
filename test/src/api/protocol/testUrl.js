const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('url', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('client.url() get', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/url');
      },
      commandName: 'url',
      args: []
    });
  });

  it('client.url() new', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/url');
        assert.deepEqual(opts.data, {url: 'http://localhost'});
      },
      commandName: 'url',
      args: ['http://localhost']
    });
  });

  it('client.url() get with callback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/url');
      },
      commandName: 'url',
      args: [function() {
        assert.equal(this.toString(), 'Nightwatch API');
      }]
    });
  });

  it('client.url() new with callback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/url');
        assert.deepEqual(opts.data, {url: 'http://localhost'});
      },
      commandName: 'url',
      args: ['http://localhost', function() {

      }]
    });
  });
});
