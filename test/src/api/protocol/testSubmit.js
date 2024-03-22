const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.submit', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testSubmit', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'submit');
      },
      commandName: 'submit',
      args: ['TEST_ELEMENT']
    }).then((result) => {
      assert.deepStrictEqual(result, null);
    });
  });

});
