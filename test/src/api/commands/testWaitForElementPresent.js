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
      assert.strictEqual(instance.expectedValue, 'found');
      assert.strictEqual(result.status, 0);
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
        assert.strictEqual(instance.expectedValue, 'found');
        assert.strictEqual(result.status, 0);
        assert.deepEqual(result.value, [{'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'}]);
      });

      client.start(done);
    });

  });

  it('client.waitForElementPresent() failure with custom message', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementPresent('.weblogin', 15, function callback(result, instance) {
      assert.ok(/^Element .weblogin found in (\d+) milliseconds$/.test(instance.message));
      assert.deepEqual(result.value, false);
    }, 'Element %s found in %d milliseconds');

    this.client.start(function(err) {
      assert.ok(err instanceof Error);
      if (err.name != 'NightwatchAssertError') {
        done(err);
      } else {
        done();
      }
    }).catch(done);
  });

  it('client.waitForElementPresent() with custom message and no params', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;

    this.client.api.waitForElementPresent({selector: '#weblogin'}, 'Element found');
    this.client.start(function(err) {
      if (err) {
        done(err);
      } else {
        done();
      }
    }).catch(done);
  });

  it('client.waitForElementPresent() with no params', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;

    this.client.api.waitForElementPresent('#weblogin');
    this.client.start(function(err) {
      assert.strictEqual(typeof err, 'undefined');
      done();
    }).catch(done);
  });

  it('client.waitForElementPresent() failure', function() {
    this.client.api.globals.waitForConditionPollInterval = 10;

    this.client.api.waitForElementPresent('.weblogin', 15, function callback(result) {
      assert.strictEqual(result.value, false);
    });

    return this.client.start(function (err) {
      assert.ok(err instanceof Error);
      if (err.name != 'NightwatchAssertError') {
        throw err;
      }
    });
  });

  it('client.waitForElementPresent() failure no abort', function(done) {
    this.client.api.waitForElementPresent('.weblogin', 15, 10, false, function callback(result) {
      assert.strictEqual(result.value, false);
    });

    this.client.start(done);
  });
});
