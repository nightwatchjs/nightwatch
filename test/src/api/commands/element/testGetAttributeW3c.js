const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('getAttribute', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getAttribute()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/attribute/class',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '13521-10219-202',
        status: 0,
        value: 'test_class'
      })
    });

    this.client.api.getAttribute('#weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    }).getAttribute('css selector', '#weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    });

    this.client.start(done);
  });
});
