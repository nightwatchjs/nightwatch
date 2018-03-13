const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.containsText', function () {
  it('containsText assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'containsText',
      args: ['.test_element', 'text result', 'Test message'],
      api: {
        getText(cssSelector, callback) {
          assert.equal(cssSelector, '.test_element');
          callback({
            value: 'expected text result'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'expected text result');
      }
    }, done);
  });

  it('containsText assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'containsText',
      args: ['.test_element', 'text result', 'Test message'],
      api: {
        getText(cssSelector, callback) {
          callback({
            value: 'not_expected'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'not_expected');
      }
    }, done);
  });

  it('containsText assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'containsText',
      args: ['.test_element', 'text result', 'Test message'],
      api: {
        getText(cssSelector, callback) {
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, null);
      }
    }, done);
  });
});

