const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowPosition', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('test .windowPosition() without offsets and callback', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current']
    }).catch(err => {
      assert.equal(err.message, 'Second argument passed to .windowPosition() should be a callback when not passing offsetX and offsetY - undefined given.');
      done();
    }).catch(err => done(err));
  });

  it('test .windowPosition() validation errors', function() {
    assert.throws(function() {
      Globals.runApiCommand.call(this, null, 'windowPosition', [function() {}]);
    }.bind(this), /First argument must be a window handle string/);

    assert.throws(
      function() {
        Globals.runApiCommand.call(this, null, 'windowPosition', ['current', 'a', 10]);
      }.bind(this), /offsetX argument passed to \.windowPosition\(\) must be a number/
    );

    assert.throws(
      function() {
        Globals.runApiCommand.call(this, null, 'windowPosition', ['current', 10, 'a']);
      }.bind(this), /offsetY argument passed to \.windowPosition\(\) must be a number/
    );
  });

  it('test .windowPosition() GET', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', function() {}]
    }).then(_ => done()).catch(err => done(err));
  });

  it('test .windowPosition() POST', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', 10, 10]
    });
  });

  it('test .windowPosition() with W3C Webdriver API - POST', function() {
    return Globals.protocolTestWebdriver.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.deepEqual(opts.data, { x: 10, y: 10 });
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowPosition',
      args: ['current', 10, 10]
    });
  });

  it('test .windowPosition() with W3C Webdriver API - GET', function() {
    return Globals.protocolTestWebdriver.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowPosition',
      args: ['current', function() {}]
    });
  });
});
