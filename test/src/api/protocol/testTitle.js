const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.title', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testTitle', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'title');
      },
      commandName: 'title',
      args: []
    }).then((result) => {
      assert.strictEqual(result, 'nightwatch');
    });
  });

});
