const assert = require('assert');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('.rightClick()', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.rightClick()', function(done) {
    const api = this.client.api;
    let rightClickArgs;
    
    this.client.transport.Actions.session.contextClick = function (args) {
      rightClickArgs = args;
      
      return Promise.resolve({
        status:0,
        value: null
      })
    }

    this.client.api.rightClick('#weblogin', function callback(result) {
      assert.deepStrictEqual(rightClickArgs.args,['5cc459b8-36a8-3042-8b4a-258883ea642b'])
      assert.strictEqual(result.status, 0);
      assert.strictEqual(this, api);
    });

    this.client.start(done);
  });

  it('client.rightClick() with xpath', function(done) {
    let rightClickArgs;
    this.client.transport.Actions.session.contextClick = function (args) {
      rightClickArgs = args;
      
      return Promise.resolve({
        status:0,
        value: null
      })
    }

    this.client.api.useXpath()
      .rightClick('//weblogin', function callback(result) {
        assert.deepStrictEqual(rightClickArgs.args, ['5cc459b8-36a8-3042-8b4a-258883ea642b'])
        assert.strictEqual(result.status, 0);
      })

    this.client.start(done);
  });

  it('client.rightClick() - element not interactable error - failed', function(done) {
    let rightClickArgs;
    this.client.transport.Actions.session.contextClick = function(args) {
      rightClickArgs = args;
      return Promise.resolve({
        status: -1,
        value: null,
        error: new Error('Element could not be scrolled into view')
      });
    }

    this.client.api.rightClick({
      retryInterval: 50,
      timeout: 100,
      selector: '#weblogin'
    }, function(result) {
      assert.deepStrictEqual(rightClickArgs.args,['5cc459b8-36a8-3042-8b4a-258883ea642b'])
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.value.error,'An error occurred while running .rightClick() command on <#weblogin>: Element could not be scrolled into view')
    });

    this.client.start(done);
  });



});
