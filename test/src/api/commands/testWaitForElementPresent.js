const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('waitForElementPresent', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementPresent() success', function(done) {
    this.client.api.waitForElementPresent('#weblogin', 100, function(result, instance) {
      assert.equal(instance.expectedValue, 'found');
      assert.equal(result.status, 0);
      assert.deepEqual(result.value[0], { ELEMENT: '0' });
    });

    this.client.start(done);
  });

  it('client.waitForElementPresent() with webdriver response success', function(done) {
    Nightwatch.initClient({
      selenium : {
        version2: false
      }
    }).then(client => {
      MockServer.addMock({
        'url': '/wd/hub/session/1352110219202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        'response': JSON.stringify({
          sessionId: '1352110219202',
          status: 0
        })
      });

      client.api.waitForElementPresent('#webdriver', 100, function(result, instance) {
        assert.equal(instance.expectedValue, 'found');
        assert.equal(result.status, 0);
        assert.deepEqual(result.value, [{'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'}]);
      });

      client.start(done);
    });

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
