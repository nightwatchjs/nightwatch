const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.submit', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testSubmit', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/element/TEST_ELEMENT/submit');
        assert.deepStrictEqual(opts.data, {});
      },
      commandName: 'submit',
      args: ['TEST_ELEMENT']
    });
  });

});
