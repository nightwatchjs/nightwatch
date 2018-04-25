const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.keys()', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testKeys', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/keys');
        assert.deepEqual(opts.data, { value: [ 'A', 'B' ] });
      },
      commandName: 'keys',
      args: [['A', 'B']]
    });
  });

  it('testKeysSingle', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.deepEqual(opts.data, { value: [ 'A' ] });
      },
      commandName: 'keys',
      args: ['A']
    });
  });

  it('testKeysUnicode', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.deepEqual(opts.data, {value: ['']});
      },
      commandName: 'keys',
      args: ['\uE007']
    });
  });

});
