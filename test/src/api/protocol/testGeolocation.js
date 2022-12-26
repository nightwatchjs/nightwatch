const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('Geolocation commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testGetGeolocation', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/location');
      },
      commandName: 'getGeolocation',
      args: []
    });
  });
});
