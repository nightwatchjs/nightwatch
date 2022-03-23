const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getLogTypes', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getLogTypes()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/se/log/types',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: ['browser', 'har']
      })
    });

    const api = this.client.api;
    this.client.api.getLogTypes(function callback(result) {
      assert.strictEqual(this, api);
      assert.ok(Array.isArray(result));
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0], 'browser');
      assert.strictEqual(result[1], 'har');
    });

    this.client.start(done);
  });
});
