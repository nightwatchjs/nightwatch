const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('browser commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testMoveTo', function () {

    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/moveto');
        assert.deepEqual(opts.data, { element: 'testElement', xoffset: 0, yoffset: 1 });
      },
      commandName: 'moveTo',
      args: ['testElement', 0, 1]
    });
  });
});
