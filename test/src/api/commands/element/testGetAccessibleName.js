const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getAccessibleName', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getAccessibleName()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/computedlabel',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'search input'
      })
    });

    this.client.api
      .getAccessibleName('#weblogin', function callback(result) {
        assert.strictEqual(result.value, 'search input');
      })
      .getAccessibleName('css selector', '#weblogin', function callback(result) {
        assert.strictEqual(result.value, 'search input');
      })
      .getAccessibleName('css selector', {selector: '#weblogin', timeout: 100}, function callback(result) {
        assert.strictEqual(result.value, 'search input');
      })
      .getAccessibleName({selector: '#weblogin', timeout: 100}, function callback(result) {
        assert.strictEqual(result.value, 'search input');
      });

    this.client.start(done);
  });
});
