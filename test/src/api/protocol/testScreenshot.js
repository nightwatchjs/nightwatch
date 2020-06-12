const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.screenshot', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testScreenshot', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/screenshot');
      },
      commandName: 'screenshot',
      args: []
    });
  });

});
