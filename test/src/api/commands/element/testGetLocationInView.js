const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getLocationInView', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getLocationInView()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/location_in_view',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: {
          x: 1,
          y: 0
        }
      })
    });

    this.client.api.getLocationInView('css selector', '#weblogin', function callback(result) {
      assert.deepStrictEqual(result.value, {x: 1, y: 0});
    }).getLocationInView('#weblogin', function callback(result) {
      assert.deepStrictEqual(result.value, {x: 1, y: 0});
    });

    this.client.start(done);
  });
});
