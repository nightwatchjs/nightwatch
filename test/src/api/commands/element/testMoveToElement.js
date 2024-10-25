const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('moveToElement', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.moveToElement()', function(done) {
    let moveToArgs;
    this.client.transport.Actions.session.moveTo = function({args, sessionId}) {
      moveToArgs = args;

      return Promise.resolve({
        status: 0
      });
    };

    this.client.api.moveToElement('css selector', '#weblogin', null, null, function(result) {
      assert.deepStrictEqual(moveToArgs, ['0', null, null]);
      assert.strictEqual(result.status, 0);
    }).moveToElement('#weblogin', null, null, function(result) {
      assert.deepStrictEqual(moveToArgs, ['0', null, null]);
      assert.strictEqual(result.status, 0);
    }).moveTo('0', null, null, function(result) {
      assert.deepStrictEqual(moveToArgs, ['0', 0, 0]);
      assert.strictEqual(result.status, 0);
    }).moveToElement('#weblogin', 1, 1, function(result) {
      assert.deepStrictEqual(moveToArgs, ['0', 1, 1]);
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
