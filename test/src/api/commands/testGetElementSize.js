const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('getElementSize', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getElementSize()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/size',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 100
      })
    });

    this.client.api.getElementSize('#weblogin', function callback(result) {
      assert.strictEqual(result.value, 100);
    }).getElementSize('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, 100);
    });

    this.client.start(done);
  });

});
