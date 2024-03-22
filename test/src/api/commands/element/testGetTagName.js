const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getTagName', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });


  it('client.getTagName()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/name',
      method: 'GET',
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: 'div'
      }
    });

    this.client.api.getTagName('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, 'div');
    }).getTagName('#weblogin', function callback(result) {
      assert.strictEqual(result.value, 'div');
    });

    this.client.start(done);
  });
});
