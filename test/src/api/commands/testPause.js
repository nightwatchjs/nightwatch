const CommandGlobals = require('../../../lib/globals/commands.js');

describe('pause', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.pause()', function(done) {
    this.client.api.pause(10, function() {
    });

    this.client.start(done);
  });
});