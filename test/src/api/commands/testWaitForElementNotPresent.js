const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('waitForElementNotPresent', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementNotPresent() success', function(done) {

    var assertion = [];
      this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

      this.client.api.globals.waitForConditionPollInterval = 10;
      this.client.api.waitForElementNotPresent('.weblogin', 10, 5, function callback(result, instance) {
      assert.equal(instance.expectedValue, 'not found');
      assert.equal(instance.rescheduleInterval, 5);

      assert.equal(assertion[0], true);
      assert.equal(assertion[3].indexOf('Element <.weblogin> was not present after'), 0);
      assert.equal(assertion[4], true); // abortOnFailure
    });

    this.client.start(done);
  }),

  it('client.waitForElementNotPresent() failure no abort', function(done) {

    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
      this.client.api.globals.waitForConditionPollInterval = 10;
      this.client.api.waitForElementNotPresent('#weblogin', 15, false, function callback(result) {
      assert.equal(result.status, 0);
      assert.equal(assertion[4], false); // abortOnFailure
    });

    this.client.start(done);
  }),

  it('client.waitForElementNotPresent() failure no abort with custom interval', function(done) {

    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementNotPresent('#weblogin', 15, 10, false, function callback(result) {
      assert.equal(result.status, 0);
      assert.equal(assertion[4], false); // abortOnFailure
    });

    this.client.start(done);
  });
});
