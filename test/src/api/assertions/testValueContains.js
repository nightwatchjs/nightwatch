const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.valueContains', function () {
  it('valueContains assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'valueContains',
      args: ['.test_element', 'some-value'],
      api: {
        getValue(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: 0,
            value: 'contains-some-value'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'contains-some-value');
        assert.ok(message.startsWith('Testing if value of <.test_element> contains: "some-value"'));
      }
    }, done);
  });

  it('valueContains assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'valueContains',
      args: ['.test_element', 'some-value'],
      api: {
        getValue(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: 0,
            value: 'wrong-value'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'wrong-value');
      }
    }, done);
  });

  it('valueContains assertion element not found', function (done) {
    Globals.assertionTest({
      assertionName: 'valueContains',
      args: ['.test_element', 'some-value'],
      api: {
        getValue(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, null);
        assert.ok(message.startsWith('Testing if value of <.test_element> contains: "some-value". Element could not be located'));
      }
    }, done);
  });

  it('valueContains assertion stale element reference', function (done) {
    let calls = 0;
    Globals.assertionTest({
      assertionName: 'valueContains',
      args: ['.test_element', 'some-value'],
      settings: {
        globals: {
          retryAssertionTimeout: 100,
          waitForConditionPollInterval: 10
        }
      },
      api: {
        elements(using, selector, callback) {
          if (calls < 2) {
            callback({
              state: 'stale element reference',
              status: -1,
              errorStatus: 10
            });
            calls++;

            return;
          }

          callback({
            status: 0,
            value: 'contains-some-value'
          });
        },

        getValue(cssSelector, callback) {
          this.elements('css selector', '.test_element', callback);
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'contains-some-value');
        assert.equal(calls, 2);
        assert.ok(message.startsWith('Testing if value of <.test_element> contains: "some-value". Element could not be located'));
      }
    }, done);
  });

  it('valueContains assertion value attribute not found', function (done) {
    Globals.assertionTest({
      assertionName: 'valueContains',
      args: ['.test_element', 'some-value'],
      api: {
        getValue(cssSelector, callback) {
          callback({
            status: 0,
            value: null
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, null);
        assert.ok(message.startsWith('Testing if value of <.test_element> contains: "some-value". Element does not have a value attribute'));
      }
    }, done);
  });
});
