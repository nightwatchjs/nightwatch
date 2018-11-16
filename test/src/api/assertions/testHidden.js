const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.hidden', function () {
  it('hidden assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'hidden',
      args: ['.test_element'],
      api: {
        isVisible(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: 0,
            value: false
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, true);
        assert.ok(message.startsWith('Testing if element <.test_element> is hidden'));
      }
    }, done);
  });

  it('hidden assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'hidden',
      args: ['.test_element'],
      api: {
        isVisible(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: 0,
            value: true
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, false);
      }
    }, done);
  });

  it('hidden assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'hidden',
      args: ['.test_element'],
      api: {
        isVisible(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, null);
        assert.ok(message.startsWith('Testing if element <.test_element> is hidden. Element could not be located'));
      }
    }, done);
  });
});

