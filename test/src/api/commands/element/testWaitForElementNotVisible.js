const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const {strictEqual} = assert;

describe('waitForElementNotVisible', function () {
  let commandResult;
  let commandInstance;

  function commandCallback(result, instance) {
    commandResult = result;
    commandInstance = instance;
  }

  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function () {
    MockServer.removeMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST'
    });
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementNotVisible() success', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });

    this.client.api.waitForElementNotVisible('#weblogin', 11, 5, commandCallback);

    return this.client.start(function (err) {
      strictEqual(err, undefined);
      strictEqual(commandResult.value, false);
    });
  });

  it('client.waitForElementNotVisible() failure', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    });

    this.client.api.waitForElementNotVisible('#weblogin', 15, 10, commandCallback);

    return this.client.start(function (err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.abortOnFailure, true);
      if (err.name !== 'NightwatchAssertError') {
        throw err;
      }

      assert.strictEqual(commandResult.status, 0);
      assert.strictEqual(err.message, `Timed out while waiting for element <#weblogin> to not be visible for 15 milliseconds. - expected "not visible" but got: "visible" (${commandInstance.elapsedTime}ms)`);
    });
  });

  it('client.waitForElementNotVisible() success after retry', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    }, true);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    }, true);

    this.client.api.globals.waitForConditionPollInterval = 50;
    this.client.api.waitForElementNotVisible('#weblogin', 150, commandCallback);

    return this.client.start(function (err) {
      strictEqual(err, undefined);
      assert.strictEqual(commandResult.status, 0);
      assert.strictEqual(commandResult.value, false);
    });
  });
});

