const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('pageSource', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.pageSource()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/source',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: '<html>Sample HTML</html>'
      })
    });

    this.client.api.pageSource(function callback(result) {
      assert.strictEqual(result.value, '<html>Sample HTML</html>');
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});