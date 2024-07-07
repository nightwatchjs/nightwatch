const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.uncheck()', function () {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.uncheck() will uncheck selected checkbox input', function (done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/click',
      'response': {
        sessionId: '1352110219202',
        status: 0
      }
    }).addMock({
      url: '/wd/hub/session/1352110219202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    }).addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'checkbox'
      })
    });

    this.client.api.uncheck('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).uncheck('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.uncheck() will uncheck selected radio input', function (done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/element/0/click',
      'response': {
        sessionId: '1352110219202',
        status: 0
      }
    }).addMock({
      url: '/wd/hub/session/1352110219202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    }).addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'radio'
      })
    });

    this.client.api.uncheck('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).uncheck('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.uncheck() will not click unselected checkbox element', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/selected',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    }).addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'checkbox'
      })
    });

    this.client.api.uncheck('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).uncheck('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
