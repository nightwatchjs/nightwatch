const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.visible', function () {
  it('visible assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'visible',
      args: ['.test_element'],
      api: {
        isVisible(cssSelector, callback) {
          assert.strictEqual(cssSelector, '.test_element');
          callback({
            status: 0,
            value: true
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, true);
        assert.ok(message.startsWith('Testing if element <.test_element> is visible'));
      }
    }, done);
  });

  it('visible assertion passed with selector object', function (done) {
    Globals.assertionTest({
      assertionName: 'visible',
      args: [{selector: '.test_element'}],
      api: {
        isVisible(cssSelector, callback) {
          assert.deepStrictEqual(cssSelector, {selector: '.test_element'});
          callback({
            status: 0,
            value: true
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, true);
        assert.ok(message.startsWith('Testing if element <.test_element> is visible'));
      }
    }, done);
  });

  it('visible assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'visible',
      args: ['.test_element'],
      api: {
        isVisible(cssSelector, callback) {
          assert.strictEqual(cssSelector, '.test_element');
          callback({
            status: 0,
            value: false
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.strictEqual(value, false);
      }
    }, done);
  });

  it('visible assertion not - element not found', function (done) {
    Globals.assertionTest({
      assertionName: 'visible',
      args: ['.test_element'],
      api: {
        isVisible(cssSelector, callback) {
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false, 'Assertion failed');
        assert.strictEqual(value, null);
        assert.ok(message.startsWith('Testing if element <.test_element> is visible. Element could not be located'));
      }
    }, done);
  });
});

