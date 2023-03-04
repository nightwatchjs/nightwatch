const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('isVisible', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function () {
    MockServer.removeMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST'
    });
    MockServer.removeMock({
      url: '/wd/hub/session/1352110219202/elements',
      method: 'POST'
    });
    MockServer.removeMock({
      url: '/wd/hub/session/1352110219202/element/999/displayed',
      method: 'GET'
    });
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.isVisible() [visible]', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    });

    this.client.api.isVisible('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, true);
    }).isVisible('#weblogin', function callback(result) {
      assert.strictEqual(result.value, true);
    });

    this.client.start(done);
  });

  it('client.isVisible() [not visible]', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });

    this.client.api.isVisible('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, false);
    }).isVisible('#weblogin', function callback(result) {
      assert.strictEqual(result.value, false);
    });

    this.client.start(done);
  });

  it('client.isVisible() [visible] -- appium', function (done) {
    MockServer
      .addMock({
        url: '/wd/hub/session/1352110219202/elements',
        postdata: {
          using: 'id',
          value: 'com.app:id/weblogin'
        },
        method: 'POST',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: [{'element-6066-11e4-a52e-4f735466cecf': '999'}]
        })
      })
      .addMock({
        url: '/wd/hub/session/1352110219202/element/999/displayed',
        method: 'GET',
        response: JSON.stringify({
          value: true
        })
      });

    // Make appium client
    this.client.api.options.selenium.use_appium = true;

    this.client.api.isVisible('id', 'com.app:id/weblogin', function callback(result) {
      assert.strictEqual(result.value, true);
    }).isVisible({selector: 'com.app:id/weblogin', locateStrategy: 'id'}, function callback(result) {
      assert.strictEqual(result.value, true);
    });

    this.client.start(done);
  });

  it('client.isVisible() [not visible] -- appium', function (done) {
    MockServer
      .addMock({
        url: '/wd/hub/session/1352110219202/elements',
        postdata: {
          using: 'id',
          value: 'com.app:id/weblogin'
        },
        method: 'POST',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: [{'element-6066-11e4-a52e-4f735466cecf': '999'}]
        })
      })
      .addMock({
        url: '/wd/hub/session/1352110219202/element/999/displayed',
        method: 'GET',
        response: JSON.stringify({
          value: false
        })
      });

    // Make appium client
    this.client.api.options.selenium.use_appium = true;

    assert.strictEqual(this.client.api.isAppiumClient(), true);

    this.client.api.isVisible('id', 'com.app:id/weblogin', function callback(result) {
      assert.strictEqual(result.value, false);
    }).isVisible({selector: 'com.app:id/weblogin', locateStrategy: 'id'}, function callback(result) {
      assert.strictEqual(result.value, false);
    });

    this.client.start(done);
  });
});
