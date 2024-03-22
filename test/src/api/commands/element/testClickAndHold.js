const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('.clickAndHold()', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.clickAndHold()', function(done) {
    const api = this.client.api;
    let clickAndHoldArgs;
    
    this.client.transport.Actions.session.pressAndHold = function(args) {
      clickAndHoldArgs = args;
      
      return Promise.resolve({
        status: 0,
        value:null
      });
    }
    
    this.client.api.clickAndHold('#weblogin', function callback(result) {
      assert.deepStrictEqual(clickAndHoldArgs.args, ['5cc459b8-36a8-3042-8b4a-258883ea642b'])
      assert.strictEqual(result.status, 0);
      assert.strictEqual(this, api);
    });

    this.client.start(done);
  });

  it('client.clickAndHold() with xpath', function(done) {

    let clickAndHoldArgs;
    this.client.transport.Actions.session.pressAndHold = function(args) {
      clickAndHoldArgs = args;

      return Promise.resolve({
        status:0,
        value: null
      })
    }

    this.client.api.useXpath()
      .clickAndHold('//weblogin', function callback(result) {
        assert.deepStrictEqual(clickAndHoldArgs.args, ['5cc459b8-36a8-3042-8b4a-258883ea642b'])
        assert.strictEqual(result.status, 0);
      })
     

    this.client.start(done);
  });


  it('client.clickAndHold() - element not interactable error - failed', function(done) {
    
    let clickAndHoldArgs;
    this.client.transport.Actions.session.pressAndHold = function(args) {
      clickAndHoldArgs = args;
      return Promise.resolve({
        status: -1,
        value: null,
        error: new Error('Element could not be scrolled into view')
      });
    }

    this.client.api.clickAndHold({
      retryInterval: 50,
      timeout: 100,
      selector: '#weblogin'
    }, function(result) {
      assert.deepStrictEqual(clickAndHoldArgs.args,['5cc459b8-36a8-3042-8b4a-258883ea642b'])
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.value.error,'An error occurred while running .clickAndHold() command on <#weblogin>: Element could not be scrolled into view')
    });

    this.client.start(done);
  });



});
