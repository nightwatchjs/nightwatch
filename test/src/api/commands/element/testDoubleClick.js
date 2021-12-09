const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('.doubleClick()', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.doubleClick()', function(done) {
   
    const api = this.client.api;
    let doubleClickArgs;
    this.client.transport.Actions.session.doubleClick = function(args) {
      doubleClickArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };
    
    this.client.api.doubleClick('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(doubleClickArgs.args, ['5cc459b8-36a8-3042-8b4a-258883ea642b']);
      assert.strictEqual(this, api);
    });

    this.client.start(done);
  });

  it('client.doubleClick() with xpath', function(done) {

    let doubleClickArgs;
    this.client.transport.Actions.session.doubleClick = function(args) {
      doubleClickArgs = args;

      return Promise.resolve({
        status: 0,
        value: null
      });
    };

    this.client.api.useXpath()
      .doubleClick('//weblogin', function callback(result) {
        assert.deepStrictEqual(doubleClickArgs.args, ['5cc459b8-36a8-3042-8b4a-258883ea642b']);
        assert.strictEqual(result.status, 0);
      });
    this.client.start(done);
  });
 
  it('client.doubleClick() - element not interactable error - failed', function(done) {
    
    let doubleClickArgs;
    this.client.transport.Actions.session.doubleClick = function(args) {
      doubleClickArgs = args;

      return Promise.resolve({
        status: -1,
        value: null,
        error: new Error('Element could not be scrolled into view')
      });
    };

    this.client.api.doubleClick({
      retryInterval: 50,
      timeout: 100,
      selector: '#weblogin'
    }, function(result) {
      assert.deepStrictEqual(doubleClickArgs.args, ['5cc459b8-36a8-3042-8b4a-258883ea642b']);
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.value.error, 'An error occurred while running .doubleClick() command on <#weblogin>: Element could not be scrolled into view');
    });

    this.client.start(done);
  });

});