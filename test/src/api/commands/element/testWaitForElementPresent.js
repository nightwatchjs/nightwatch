const assert = require('assert');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('waitForElementPresent', function() {
  beforeEach(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementPresent() success', function(done) {
    this.client.api.waitForElementPresent('#weblogin', 100, function(result, instance) {
      assert.strictEqual(instance.expectedValue, 'found');
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value[0], {ELEMENT: '0'});
    });

    this.client.start(done);
  });

  it('client.waitForElementPresent() with webdriver response success', function(done) {
    Nightwatch.initW3CClient({
    }).then(client => {
      client.api.waitForElementPresent('#webdriver', 100, function(result, instance) {
        assert.strictEqual(instance.expectedValue, 'found');
        assert.strictEqual(result.status, 0);
        assert.deepStrictEqual(result.value, [
          {'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'},
          {'element-6066-11e4-a52e-4f735466cecf': '3783b042-7001-0740-a2c0-afdaac732e9f'}
        ]);
      });

      client.start(done);
    });

  });

  it('client.waitForElementPresent() failure with custom message', function(done) {
    this.client.api.globals.waitForConditionPollInterval = 10;
    this.client.api.waitForElementPresent('.weblogin', 15, function callback(result, instance) {
      assert.ok(/^Element .weblogin found in (\d+) milliseconds$/.test(instance.message));
      assert.deepStrictEqual(result.value, false);
    }, 'Element %s found in %d milliseconds');

    this.client.start(function(err) {
      assert.ok(err instanceof Error);
      if (err.name !== 'NightwatchAssertError') {
        done(err);
      } else {
        done();
      }
    }).catch(done);
  });

  it('client.waitForElementPresent() failure with custom time message', function(done){
    this.client.api.globals.waitForConditionPollInterval=10;
    this.client.api.waitForElementPresent('.weblogin', 15, function callback(result, instance){
      assert.strictEqual(instance.message, 'Element .weblogin found in 15 milliseconds');
    }, 'Element %s found in %d milliseconds');

    this.client.start(function(err) {
      assert.ok(err instanceof Error);
      if (err.name !== 'NightwatchAssertError') {
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
      if (err.name !== 'NightwatchAssertError') {
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
