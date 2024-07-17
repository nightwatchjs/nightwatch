const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.check()', function () {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.check() will click unselected checkbox', function (done) {
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

    this.client.api.check('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).check('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.check() will click unselected radio input', function (done) {
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
        value: false
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

    this.client.api.check('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).check('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.check() will not click selected checkbox', function (done) {
    MockServer.addMock({
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

    this.client.api.check('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).check('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });

  it('client.check() will not click selected radio input', function (done) {
    MockServer.addMock({
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

    this.client.api.check('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    }).check('#weblogin', function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
