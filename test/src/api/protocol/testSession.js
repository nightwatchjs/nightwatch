const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('session commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testSessions', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/sessions');
      },
      commandName: 'sessions',
      args: []
    });
  });

  it('testSessionDefault', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: []
    });
  });

  it('testSessionGETImplicit', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: []
    });
  });

  it('testSessionGETExplicit', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['GET']
    });
  });

  it('testSessionGETImplicitById', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['1352110219202']
    });
  });

  it('testSessionGETExplicitById', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['GET', '1352110219202']
    });
  });

  it('testSessionDELETE', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'DELETE');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['DELETE']
    });
  });

  it('testSessionDELETEById', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'DELETE');
        assert.equal(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['DELETE', '1352110219202']
    });
  });

  it('testSessionPOST', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session');
      },
      commandName: 'session',
      args: ['POST']
    });
  });

});
