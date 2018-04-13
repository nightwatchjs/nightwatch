const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('isVisible', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function() {
    MockServer.removeMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET'
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.isVisible()', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : true
      })
    });

    this.client.api.isVisible('css selector', '#weblogin', function callback(result) {
      assert.equal(result.value, true);
    }).isVisible('#weblogin', function callback(result) {
      assert.equal(result.value, true);
    });

    this.client.start(done);
  });
});
