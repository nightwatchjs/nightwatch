const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.screenshot', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testScreenshot', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'screenshot');
      },
      commandName: 'screenshot',
      args: []
    }).then((result) => {
      assert.strictEqual(result, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==');
    });
  });

});
