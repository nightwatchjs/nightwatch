const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowRect', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('test .windowRect() validation errors', function() {
    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowRect', [{width: 'a', height: 10}]);
      }.bind(this), /Width argument passed to \.windowRect\(\) must be a number; received: string \(a\)\.$/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowRect', [{width: 10, height: 'a'}]);
      }.bind(this), /Height argument passed to \.windowRect\(\) must be a number; received: string \(a\)\.$/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowRect', [{width: 10}]);
      }.bind(this), /Attributes "width" and "height" must be specified together\.$/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowRect', [{x: 'a', y: 10}]);
      }.bind(this), /X position argument passed to \.windowRect\(\) must be a number; received: string \(a\)\.$/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowRect', [{x: 10, y: 'a'}]);
      }.bind(this), /Y position argument passed to \.windowRect\(\) must be a number; received: string \(a\)\.$/
    );

    assert.throws(
      function() {
        Globals.runApiCommand(null, 'windowRect', [{x: 10}]);
      }.bind(this), /Attributes "x" and "y" must be specified together\.$/
    );
  });

  it('test .windowRect() GET', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowRect',
      args: [null, function() {}]
    });
  });

  it('test .windowRect() POST', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
        assert.deepEqual(opts.data, { width: 10, height: 10, x: 10, y: 10 } );
      },
      commandName: 'windowRect',
      args: [{width: 10, height: 10, x: 10, y: 10}]
    });
  });

});
