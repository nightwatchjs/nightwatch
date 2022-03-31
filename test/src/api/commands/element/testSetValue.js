const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('setValue', function() {

  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.setValue()', function(done) {
    
     
    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
      method: 'POST',
      statusCode: 200,
      response: {
        value: null
      }
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/value',
      method: 'POST',
      postdata: {text: 'password', value: ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        value: null
      }
    });

    this.client.api
      .setValue('css selector', '#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setValue('css selector', {
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setValue({
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setValue('#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });

  it('client.setValue - non editable element', function(done) {
    
    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
      method: 'POST',
      statusCode: 400,
      response: {
        value: {
          error: 'invalid element state',
          message: 'Unable to clear element that cannot be edited',
          stacktrace: ''
        }
      }
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/value',
      method: 'POST',
      postdata: {text: 'password', value: ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    this.client.api.setValue('#weblogin', 'password', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
    
  });
});
