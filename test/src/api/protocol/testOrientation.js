const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const {strictEqual} = assert;

describe('orientation commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testGetOrientation', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        strictEqual(opts.method, 'GET');
        strictEqual(opts.path, '/session/1352110219202/orientation');
      },
      commandName: 'getOrientation',
      args: []
    });
  });

  it('testSetOrientation', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        strictEqual(opts.method, 'POST');
        strictEqual(opts.path, '/session/1352110219202/orientation');
        assert.deepEqual(opts.data, {orientation: 'LANDSCAPE'});
      },
      commandName: 'setOrientation',
      args: ['LANDSCAPE']
    });
  });

  it('testSetOrientationInvalid', function () {
    return Globals.protocolTest({
      assertion: function(opts) {

      },
      commandName: 'setOrientation',
      args: ['TEST']
    }).catch(err => {
      strictEqual(err.message, 'Error while running "setOrientation" command: Invalid screen orientation value specified. Accepted values are: LANDSCAPE, PORTRAIT');

      return true;
    }).then(result => assert.strictEqual(result, true));
  });
});
