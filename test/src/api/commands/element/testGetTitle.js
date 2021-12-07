const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getTitle', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });
  it('client.getTitle()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/title',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'sample Title'
      })
    });

    this.client.api.getTitle(function callback(result) {
      assert.strictEqual(result, 'sample Title');
    });

    this.client.start(done);
  });
});
