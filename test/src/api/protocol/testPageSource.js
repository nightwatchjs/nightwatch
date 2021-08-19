const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.source', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testSource', function () {
    return Globals.protocolTest({
      assertion({command}) {
        assert.strictEqual(command, 'getPageSource');
      },
      commandName: 'source',
      args: []
    }).then((result) => {
      assert.strictEqual(result.value, '<html><body></body></html>');
      assert.strictEqual(result.status, 0);
    });
  });

});
