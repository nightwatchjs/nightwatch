const assert = require('assert');
const common = require('../../../common.js');
const NightwatchAssertion = common.require('core/assertion.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('waitForElementNotPresent', function () {
  const createOrig = NightwatchAssertion.create;

  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementNotPresent() success', function (done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return createOrig(...args);
    };

    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('.weblogin', 50, 5, function(result, instance) {
      assert.strictEqual(instance.executor.retries, 0);
      assert.strictEqual(instance.expectedValue, 'not found');
      assert.strictEqual(instance.rescheduleInterval, 5);

      assert.strictEqual(assertion[0], true);
      assert.ok(instance.message.startsWith('Element <.weblogin> was not present after'));
      assert.strictEqual(instance.abortOnFailure, true);
      NightwatchAssertion.create = createOrig;
    });

    this.client.start(done);
  });

  it('client.waitForElementNotPresent() failure', function () {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return createOrig(...args);
    };

    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, function(result, instance) {
      assert.strictEqual(assertion[0], false);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(instance.abortOnFailure, true);
      NightwatchAssertion.create = createOrig;
    });

    return this.client.start(function (err) {
      assert.strictEqual(assertion.length, 6);
      assert.ok(err instanceof Error);
      assert.ok(err.message.startsWith('Error while running "waitForElementNotPresent" command: Timed out while waiting for element <#weblogin> to be removed for 15 milliseconds.'));
    });
  });

  it('client.waitForElementNotPresent() failure no abort', function () {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return createOrig(...args);
    };

    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, false, function(result, instance) {
      assert.strictEqual(assertion[0], false);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(instance.abortOnFailure, false);
      NightwatchAssertion.create = createOrig;
    });

    return this.client.start(function (err) {
      assert.strictEqual(assertion.length, 6);
      assert.strictEqual(typeof err, 'undefined');
    });
  });

  it('client.waitForElementNotPresent() failure no abort with custom interval', function (done) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, 10, false, function(result, instance) {
      assert.strictEqual(result.status, 0);
      assert.strictEqual(instance.rescheduleInterval, 10);
      assert.strictEqual(instance.ms, 15);
      assert.strictEqual(instance.abortOnFailure, false);
    });

    this.client.start(done);
  });
});
