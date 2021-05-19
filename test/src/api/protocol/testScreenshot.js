const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.screenshot', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testScreenshot', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/screenshot');
      },
      commandName: 'screenshot',
      args: []
    });
  });

});
