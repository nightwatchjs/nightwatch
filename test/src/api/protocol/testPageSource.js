const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.getPageSource', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testPageSource', function() {
    return Globals.protocolTest({
      assertion: function() {},
      commandName: 'getPageSource',
      args: []
    }).then((result) => {
      assert.strictEqual(result.value, "PageSource");
      assert.strictEqual(result.status, 0);
    });
  });

});