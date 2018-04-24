const assert = require('assert');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('waitForElementPresent', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementPresent() success', function(done) {
    this.client.api.waitForElementPresent('#weblogin', 100, function callback(result, instance) {
      assert.equal(instance.expectedValue, 'found');
      assert.equal(result.status, 0);
      assert.equal(result.value[0].ELEMENT, '0');
    });

    this.client.start(done);
  });

  it('client.waitForElementPresent() with webdriver response success', function(done) {
    this.client.api.waitForElementPresent('#webdriver', 100, function callback(result, instance) {
      assert.equal(instance.expectedValue, 'found');
      assert.equal(result.status, 0);
      assert.equal(result.value[0].ELEMENT, '5cc459b8-36a8-3042-8b4a-258883ea642b');
    });

    this.client.start(done);
  });

  it('client.waitForElementPresent() failure with custom message', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementPresent('.weblogin', 15, function callback(result, instance) {
      assert.equal(instance.message, 'Element .weblogin found in 15 milliseconds');
      assert.equal(result.value, false);
    }, 'Element %s found in %d milliseconds');

    this.client.start(done);
  });

  it('client.waitForElementPresent() failure', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;

    this.client.api.waitForElementPresent('.weblogin', 15, function callback(result) {
      assert.equal(result.value, false);
    });

    this.client.start(done);
  });

  it('client.waitForElementPresent() failure no abort', function(done) {
    this.client.api.waitForElementPresent('.weblogin', 100, false, function callback(result) {
      assert.equal(result.value, false);
    });

    this.client.start(done);
  });
});
