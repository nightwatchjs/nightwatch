const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('getPageSource', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });
  it('client.getPageSource()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/source',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: '<html>Sample HTML</html>'
      })
    });

    this.client.api.getPageSource(function callback(result) {
      assert.strictEqual(result, '<html>Sample HTML</html>');
    });

    this.client.start(done);
  });
});
