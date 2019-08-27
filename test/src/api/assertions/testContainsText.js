const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.containsText', function () {
  it('containsText assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'containsText',
      args: ['.test_element', 'text result', 'Test message'],
      api: {
        getText(cssSelector, callback) {
          assert.strictEqual(cssSelector, '.test_element');
          callback({
            value: 'expected text result'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'expected text result');
      }
    }, done);
  });

  it('containsText assertion passed with selector object', function (done) {
    Globals.assertionTest({
      assertionName: 'containsText',
      args: [{selector: '.test_element'}, 'text result'],
      api: {
        getText(cssSelector, callback) {
          assert.deepStrictEqual(cssSelector, {selector: '.test_element'});
          callback({
            value: 'expected text result'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.ok(message.startsWith('Testing if element <.test_element> contains text: "text result"'));
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
        assert.strictEqual(passed, false);
        assert.strictEqual(value, 'not_expected');
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
        assert.strictEqual(passed, false);
        assert.strictEqual(value, null);
      }
    }, done);
  });
});

