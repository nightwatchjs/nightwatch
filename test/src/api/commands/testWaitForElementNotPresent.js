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
    this.client.api.waitForElementNotPresent('.weblogin', 10, 5, function(result, instance) {
      assert.equal(instance.expectedValue, 'not found');
      assert.equal(instance.rescheduleInterval, 5);

      assert.equal(assertion[0], true);
      assert.ok(instance.message.startsWith('Element <.weblogin> was not present after'));
      assert.equal(instance.abortOnFailure, true);
      NightwatchAssertion.create = createOrig;
    });

    this.client.start(done);
  });

  it('client.waitForElementNotPresent() failure no abort', function (done) {
    const assertion = [];

    NightwatchAssertion.create = function(...args) {
      assertion.unshift(...args);

      return createOrig(...args);
    };

    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, false, function(result, instance) {
      assert.strictEqual(assertion[0], false);
      assert.equal(result.status, 0);
      assert.equal(instance.abortOnFailure, false);
      NightwatchAssertion.create = createOrig;
    });

    this.client.start(done);
  });

  it('client.waitForElementNotPresent() failure no abort with custom interval', function (done) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, 10, false, function(result, instance) {
      assert.equal(result.status, 0);
      assert.equal(instance.rescheduleInterval, 10);
      assert.equal(instance.ms, 15);
      assert.equal(instance.abortOnFailure, false);
    });

    this.client.start(done);
  });
});
