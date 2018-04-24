const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('url', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('client.url() get', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/url');
      },
      commandName: 'url',
      args: []
    });
  });

  it('client.url() new', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/url');
        assert.deepEqual(opts.data, {url: 'http://localhost'});
      },
      commandName: 'url',
      args: ['http://localhost']
    });
  });

  it('client.url() get with callback', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/url');
      },
      commandName: 'url',
      args: [function() {
        done();
      }]
    });
  });

  it('client.url() new with callback', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/url');
        assert.deepEqual(opts.data, {url: 'http://localhost'});
      },
      commandName: 'url',
      args: ['http://localhost', function() {
        done();
      }]
    });
  });
});
