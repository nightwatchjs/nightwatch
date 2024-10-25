const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('moveToElement', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.dragAndDrop()', function(done) {
    let dragArgs ;
    this.client.transport.Actions.session.dragElement = function({args, sessionId}) {
      dragArgs = args;

      return Promise.resolve({
        status: 0
      });
    };

    this.client.api.dragAndDrop('css selector', '#weblogin', {x: 10, y: 10}, function(result) {
      assert.deepStrictEqual(dragArgs, ['0', {x: 10, y: 10}]);
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.dragAndDrop() with destination as a webelement ', function(done) {
    let dragArgs ;
    this.client.transport.Actions.session.dragElement = function({args, sessionId}) {
      dragArgs = args;

      return Promise.resolve({
        status: 0
      });
    };

    this.client.api.dragAndDrop('css selector', '#weblogin', '0', function(result) {
      assert.deepStrictEqual(dragArgs, ['0', '0']);
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
