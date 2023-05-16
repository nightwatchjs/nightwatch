const path = require('path');
const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const {strictEqual} = assert;
const common = require('../../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');
const MockServer = require('../../../../lib/mockserver.js');


describe('waitForElementNotPresent', function () {
  let commandResult;
  let commandInstance;

  function commandCallback(result, instance) {
    commandResult = result;
    commandInstance = instance;
  }

  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementNotPresent() success', function () {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('.weblogin', 50, 5, commandCallback);

    return this.client.start(function(err) {
      strictEqual(err, undefined);
      assert.deepStrictEqual(commandResult.value, null);
      strictEqual(commandInstance.executor.retries, 0);
      strictEqual(commandInstance.expectedValue, 'not found');
      strictEqual(commandInstance.rescheduleInterval, 5);
      strictEqual(commandInstance.abortOnFailure, true);
      assert.ok(commandInstance.message.startsWith('Element <.weblogin> was not present after'));
    });
  });

  it('client.waitForElementNotPresent() failure', function () {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, commandCallback);

    return this.client.start(function (err) {
      assert.ok(err instanceof Error);
      assert.deepStrictEqual(commandResult.value, [{ELEMENT: '0'}]);
      strictEqual(err.message, `Timed out while waiting for element <#weblogin> to be removed for 15 milliseconds. - expected "not found" but got: "found" (${commandInstance.elapsedTime}ms)`);
    });
  });

  it('client.waitForElementNotPresent() failure no abort', function () {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, false, commandCallback);

    return this.client.start(function (err) {
      strictEqual(commandResult.status, 0);
      strictEqual(commandInstance.abortOnFailure, false);
      strictEqual(commandInstance.elementId, null);
    });
  });

  it('client.waitForElementNotPresent() failure no abort with custom interval', function () {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, 10, false, commandCallback);

    this.client.api.waitForElementNotPresent('#weblogin', 15, 10, false, function(result, instance) {
      strictEqual(result.status, 0);
      strictEqual(instance.rescheduleInterval, 10);
      strictEqual(instance.ms, 15);
      strictEqual(instance.abortOnFailure, false);
    });

    return this.client.start(function (err) {
      strictEqual(commandResult.status, 0);
      strictEqual(commandInstance.ms, 15);
      strictEqual(commandInstance.rescheduleInterval, 10);
    });
  });


  it('client.waitForElementNotPresent() report should not contain error in case of success', async function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      method: 'POST',
      postdata: {
        using: 'css selector',
        value: '#badElement'
      },
      response: JSON.stringify({
        value: []
      }),
      times: 2
    });

    const testsPath = [
      path.join(__dirname, '../../../../sampletests/withwait/elementNotPresent.js')
    ];

    const globals = {
      calls: 0,
      reporter(results) {
        assert.strictEqual(globals.calls, 2);
        assert.strictEqual(Object.keys(results.modules).length, 1);
        assert.ok('elementNotPresent' in results.modules);
        assert.strictEqual(results.modulesWithEnv.default.elementNotPresent.completedSections.demoTest.commands[1].status, 'pass');
        assert.strictEqual(results.modulesWithEnv.default.elementNotPresent.completedSections.demoTest.commands[2].status, 'fail');
      }
    };

    await NightwatchClient.runTests(testsPath, settings({
      globals
    }));
  });
});
