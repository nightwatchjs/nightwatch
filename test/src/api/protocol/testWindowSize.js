const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowSize', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('test .windowSize() errors', function() {
    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowSize', [function() {}]);
      }.bind(this), /First argument must be a window handle string/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowSize', ['current', 'a', 10]);
      }.bind(this), /Width argument passed to \.windowSize\(\) must be a number/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowSize', ['current', 10, 'a']);
      }.bind(this), /Height argument passed to \.windowSize\(\) must be a number/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowSize', ['current', 10]);
      }.bind(this), /Second argument passed to \.windowSize\(\) should be a callback when not passing width and height/
    );
  });

  it('test .windowSize() GET', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/window/current/size');
      },
      commandName: 'windowSize',
      args: ['current', function() {
        done();
      }]
    });
  });

  it('test .windowSize() POST', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/window/current/size');
        assert.deepEqual(opts.data, {width: 10, height: 10});
      },
      commandName: 'windowSize',
      args: ['current', 10, 10]
    });
  });

  it('test .windowSize() with W3C Webdriver API - POST', function() {
    return Globals.protocolTestWebdriver.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.deepEqual(opts.data, { width: 10, height: 10 });
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowSize',
      args: ['current', 10, 10]
    });
  });

  it('test .windowSize() with W3C Webdriver API - GET', function() {
    return Globals.protocolTestWebdriver.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowSize',
      args: ['current', function() {}]
    });
  });
});
