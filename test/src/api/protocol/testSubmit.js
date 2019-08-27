const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.submit', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testSubmit', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/element/TEST_ELEMENT/submit');
        assert.deepEqual(opts.data, {});
      },
      commandName: 'submit',
      args: ['TEST_ELEMENT']
    });
  });

});
