const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowPosition', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test .windowPosition() without offsets and callback', function(done) {
    Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current']
    }).catch(err => {
      assert.equal(err.message, 'Error while running "windowPosition" command: Second argument passed to .windowPosition() should be a callback when not passing offsetX and offsetY - undefined given.');
      done();
    }).catch(err => done(err));
  });

  it('test .windowPosition() validation errors', async function() {
    let msgone;
    let msgtwo;
    let msgthree;

    try {
      await Globals.protocolTest({
        commandName: 'windowPosition',
        args: [function () {}]
      });
    } catch (err) {
      msgone = err.message;
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowPosition',
        args: ['current', 'a', 10]
      });
    } catch (err) {
      msgtwo = err.message;
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowPosition',
        args: ['current', 10, 'a']
      });
    } catch (err) {
      msgthree = err.message;
    }

    assert.strictEqual(msgone, 'Error while running "windowPosition" command: First argument must be a window handle string.');
    assert.strictEqual(msgtwo, 'Error while running "windowPosition" command: offsetX argument passed to .windowPosition() must be a number.');
    assert.strictEqual(msgthree, 'Error while running "windowPosition" command: offsetY argument passed to .windowPosition() must be a number.');

  });

  it('test .windowPosition() GET', function(done) {
    Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', function() {}]
    }).then(_ => done()).catch(err => done(err));
  });

  it('test .windowPosition() POST', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', 10, 10]
    });
  });

  it('test .windowPosition() with W3C Webdriver API - POST', function() {
    return Globals.protocolTestWebdriver({
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
    return Globals.protocolTestWebdriver({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowPosition',
      args: ['current', function() {}]
    });
  });
});
