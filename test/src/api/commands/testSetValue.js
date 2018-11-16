const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('setValue', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.setValue()', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/value',
      method:'POST',
      postdata : '{"value":["1"]}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    this.client.api.setValue('css selector', '#weblogin', '1', function callback(result) {
      assert.equal(result.status, 0);
    }).setValue('#weblogin', '1', function callback(result) {
      assert.equal(result.status, 0);
    });

    this.client.start(done);
  });
});
