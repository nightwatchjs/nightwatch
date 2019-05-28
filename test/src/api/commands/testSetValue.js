const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
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
      postdata : {value:[ 'p', 'a', 's', 's', 'w', 'o', 'r', 'd' ]},
      response : {
        sessionId: '1352110219202',
        status:0
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
});
