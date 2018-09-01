const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.value', function () {
  it('value assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'value',
      args: ['.test_element', 'some-value'],
      api: {
        getValue(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: 0,
            value: 'some-value'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'some-value');
        assert.ok(message.startsWith('Testing if value of <.test_element> equals: "some-value"'));
      }
    }, done);
  });

  it('value assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'value',
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

  it('value assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'value',
      args: ['.test_element', 'some-value'],
      api: {
        getValue(cssSelector, callback) {
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, null);
        assert.ok(message.startsWith('Testing if value of <.test_element> equals: "some-value". Element or attribute could not be located'));
      }
    }, done);
  });
});

