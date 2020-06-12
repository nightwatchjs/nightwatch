const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('waitForElementVisible', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  let commandInstance;
  it('client.waitForElementVisible() failure', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });

    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementVisible('#weblogin', 15, 10, function (result, instance) {
      assert.deepStrictEqual(instance.args, [15, 10]);
      assert.strictEqual(instance.executor.retries, 1);
      assert.strictEqual(instance.message, 'Timed out while waiting for element <#weblogin> to be visible for 15 milliseconds.');
      assert.strictEqual(instance.expectedValue, 'visible');
      assert.strictEqual(instance.selector, '#weblogin');
      assert.strictEqual(instance.strategy, 'css selector');
      assert.strictEqual(instance.suppressNotFoundErrors, false);
      assert.strictEqual(instance.__timeoutMs, 15);
      assert.strictEqual(instance.throwOnMultipleElementsReturned, false);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, false);
    });

    this.client.start(done);
  });

  it('client.waitForElementVisible() fail with global timeout default', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });

    this.client.api.globals.waitForConditionTimeout = 15;
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementVisible('#weblogin', function callback(result, instance) {
      commandInstance = instance;
      assert.strictEqual(instance.expectedValue, 'visible');
      assert.strictEqual(instance.message, 'Timed out while waiting for element <#weblogin> to be visible for 15 milliseconds.');
      assert.strictEqual(result.status, 0);
    });

    return this.client.start(function(err) {
      if (!err) {
        throw new Error('Expected error but got none');
      }

      if (err.name === 'NightwatchAssertError') {
        assert.strictEqual(err.abortOnFailure, true);
        assert.strictEqual(err.message, `Timed out while waiting for element <#weblogin> to be visible for 15 milliseconds. - expected "visible" but got: "not visible" (${commandInstance.elapsedTime}ms)`);

        return;
      }

      throw err;
    });
  });

  it('client.waitForElementVisible() fail with global timeout default and custom message', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    });

    this.client.api.globals.waitForConditionTimeout = 15;
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementVisible('#weblogin', function callback(result, instance) {
      commandInstance = instance;
      assert.strictEqual(instance.message, 'Test message <#weblogin> and a global 15 ms.');
    }, 'Test message <%s> and a global %s ms.');

    return this.client.start(function(err) {
      if (!err) {
        throw new Error('Expected error but got none');
      }

      if (err.name === 'NightwatchAssertError') {
        assert.strictEqual(err.message, `Test message <#weblogin> and a global 15 ms. - expected "visible" but got: "not visible" (${commandInstance.elapsedTime}ms)`);

        return;
      }

      throw err;
    });
  });

  it('client.waitForElementVisible() StaleElementReference error', function () {
    MockServer
      .addMock({
        url: '/wd/hub/session/1352110219202/elements',
        postdata : '{"using":"css selector","value":"#stale-element"}',
        method: 'POST',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: [{ELEMENT: '99'}]
        })
      })
      .addMock({
        url: '/wd/hub/session/1352110219202/element/99/displayed',
        method: 'GET',
        response: JSON.stringify({
          sessionId: '1352110219202',
          state: 'stale element reference',
          status: 10
        })
      }, true)
      .addMock({
        url: '/wd/hub/session/1352110219202/element/99/displayed',
        method: 'GET',
        response: JSON.stringify({
          state: 'success',
          status: 0,
          value: true
        })
      }, true);

    this.client.api.waitForElementVisible('#stale-element', 110, 10, function callback(result, instance) {
      assert.strictEqual(instance.elementId, '99');
      assert.strictEqual(result.value, true);
    });

    return this.client.start(function(err) {
      MockServer.removeMock({
        url: '/wd/hub/session/1352110219202/elements',
        method: 'POST'
      });

      if (err) {
        throw err;
      }
    });
  });

  it('client.waitForElementVisible() with element not found', function () {
    let result;

    this.client.api.globals.waitForConditionPollInterval = 5;
    this.client.api.waitForElementVisible('.weblogin', 11, function (res, instance) {
      commandInstance = instance;
      result = res;
    });

    return this.client.start(function(e) {
      assert.strictEqual(result.value, false);
      assert.strictEqual(result.status, -1);
      assert.strictEqual(result.err.value, null);
      assert.strictEqual(e.message, `Timed out while waiting for element <.weblogin> to be present for 11 milliseconds. - expected "visible" but got: "not found" (${commandInstance.elapsedTime}ms)`);
    });
  });

  it('client.waitForElementVisible() success after retry', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: false
      })
    }, true);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/displayed',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: true
      })
    }, true);

    let commandResult;
    let commandInstance;

    this.client.api.globals.waitForConditionPollInterval = 50;
    this.client.api.waitForElementVisible('#weblogin', 110, function (result, instance) {
      commandInstance = instance;
      commandResult = result;
    });

    return this.client.start(function(err) {
      assert.strictEqual(commandResult.value, true);
      assert.strictEqual(commandInstance.executor.retries, 1);
      assert.strictEqual(err, undefined);
    });
  });

  it('client.waitForElementVisible() fail with no args and global timeout not set', function () {
    this.client.api.globals.waitForConditionTimeout = null;

    this.client.api.waitForElementVisible('foo');

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('waitForElement expects second parameter to have a global default (waitForConditionTimeout) to be specified if not passed as the second parameter'));
    });
  });
});
