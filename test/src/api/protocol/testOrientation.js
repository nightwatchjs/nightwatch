const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('orientation commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testGetOrientation', function () {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/orientation');
      },
      commandName: 'getOrientation',
      args: []
    });
  });

  it('testSetOrientation', function () {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/orientation');
        assert.deepEqual(opts.data, {orientation: 'LANDSCAPE'});
      },
      commandName: 'setOrientation',
      args: ['LANDSCAPE']
    });
  });

  it('testSetOrientationInvalid', function () {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {

      },
      commandName: 'setOrientation',
      args: ['TEST']
    }).catch(err => {
      assert.equal(err.message, 'Invalid screen orientation value specified. Accepted values are: LANDSCAPE, PORTRAIT');
      
      return true;
    }).then(result => assert.strictEqual(result, true));
  });
});
