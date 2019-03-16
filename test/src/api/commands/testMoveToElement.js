const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('moveToElement', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.moveToElement()', function(done) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/moveto',
      method:'POST',
      postdata: '{"element":"0"}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/moveto',
      method:'POST',
      postdata: '{"element":"0","xoffset":1,"yoffset":1}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });

    this.client.api.moveToElement('css selector', '#weblogin', null, null, function(result) {
      assert.strictEqual(result.status, 0);
    }).moveToElement('#weblogin', null, null, function(result) {
      assert.strictEqual(result.status, 0);
    }).moveTo('0', null, null, function(result) {
      assert.strictEqual(result.status, 0);
    }).moveToElement('#weblogin', 1, 1, function(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
