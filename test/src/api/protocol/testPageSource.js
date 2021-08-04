const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.pageSource', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testPageSource', function() {
    return Globals.protocolTest({
      assertion({command}) {
        assert.strictEqual(command, 'getPageSource');
      },
      commandName: 'pageSource',
      args: []
    }).then((result) => {
      assert.strictEqual(result.value, '<html><body></body></html>');
      assert.strictEqual(result.status, 0);
    });
  });

});