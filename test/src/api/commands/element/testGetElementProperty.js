const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getElementProperty', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getElementProperty()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/property/display',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'block'
      })
    });

    this.client.api.getElementProperty('#weblogin', 'display', function callback(result) {
      assert.strictEqual(result.value, 'block');
    });

    this.client.start(done);
  });
});
