const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('session commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testSessions', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/sessions');
      },
      commandName: 'sessions',
      args: []
    });
  });

  it('testSessionDefault', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: []
    });
  });

  it('testSessionGETImplicit', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: []
    });
  });

  it('testSessionGETExplicit', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['GET']
    });
  });

  it('testSessionGETImplicitById', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['1352110219202']
    });
  });

  it('testSessionGETExplicitById', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['GET', '1352110219202']
    });
  });

  it('testSessionDELETE', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'DELETE');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['DELETE']
    });
  });

  it('testSessionDELETEWithCallback', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'DELETE');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['DELETE', function() {

      }]
    });
  });

  it('testSessionDELETEById', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'DELETE');
        assert.strictEqual(opts.path, '/session/1352110219202');
      },
      commandName: 'session',
      args: ['DELETE', '1352110219202']
    });
  });

  it('testSessionPOST', function() {
    Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session');
      },
      commandName: 'session',
      args: ['POST']
    });
  });

});
