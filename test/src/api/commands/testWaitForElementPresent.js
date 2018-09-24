const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

const initClient = () => Nightwatch.initClient();

describe('waitForElementPresent', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.waitForElementPresent() success', function(done) {
    initClient()
      .then(client => {
        client.api.waitForElementPresent('#weblogin', 100, function(result, instance) {
          assert.equal(instance.expectedValue, 'found');
          assert.equal(result.status, 0);
          assert.deepEqual(result.value[0], { ELEMENT: '0' });
        });

        client.start(done);
      });
  });

  it('client.waitForElementPresent() with webdriver response success', function(done) {
    initClient()
      .then(client => {

        client.api.waitForElementPresent('#webdriver', 100, function(result, instance) {
          assert.equal(instance.expectedValue, 'found');
          assert.equal(result.status, 0);
          assert.deepEqual(result.value, [{'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'}]);
        }).end();

        client.start(done);
      });
  });

  it('client.waitForElementPresent() failure with custom message', function(done) {
    initClient()
      .then(client => {

        client.api.globals.waitForConditionPollInterval = 10;
        client.api.waitForElementPresent('.weblogin', 15, function callback(result, instance) {
          assert.equal(instance.message, 'Element .weblogin found in 15 milliseconds');
          assert.equal(result.value, false);
        }, 'Element %s found in %d milliseconds').end();

        client.queue.run((err) => {
          if (err) {
            try {
              assert.equal(err.message,
                'Element .weblogin found in 15 milliseconds - expected \u001b[0;32m"found"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m'
              );
              done();
            } catch (err) {
              done(err);
            }
            return;
          }
          done(Error('client.waitForElementPresent() should have failed'));
        });
      });
  });

  it('client.waitForElementPresent() failure', function(done) {
    initClient()
      .then(client => {
        client.api.globals.waitForConditionPollInterval = 10;

        client.api.waitForElementPresent('.weblogin', 15, function callback(result) {
          assert.equal(result.value, false);
        }).end();

        client.queue.run((err) => {
          if (err) {
            try {
              assert.equal(err.message,
                'Timed out while waiting for element <.weblogin> to be present for 15 milliseconds. - expected \u001b[0;32m"found"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m'
              );
              done();
            } catch (err) {
              done(err);
            }
            return;
          }
          done(Error('client.waitForElementPresent() should have failed'));
        });
      });
  });

  it('client.waitForElementPresent() failure no abort', function(done) {
    initClient()
      .then(client => {
        client.api.waitForElementPresent('.weblogin', 100, false, function callback(result) {
          assert.equal(result.value, false);
        });

        client.queue.run(done);
      });
  });
});
