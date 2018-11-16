const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.cssClassPresent', function () {
  it('cssClassPresent assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'cssClassPresent',
      args: ['.test_element', 'test-css-class'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.equal(cssSelector, '.test_element');
          assert.equal(attribute, 'class');
          callback({
            value: 'other-css-class test-css-class'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.equal(value, 'other-css-class test-css-class');
        assert.ok(message.startsWith('Testing if element <.test_element> has css class: "test-css-class"'));
      }
    }, done);
  });

  it('cssClassPresent assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'cssClassPresent',
      args: ['.test_element', 'test-css-class'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          callback({
            value: 'other-css-class'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.equal(value, 'other-css-class');
      }
    }, done);
  });

  it('cssClassPresent assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'cssClassPresent',
      args: ['.test_element', 'test-css-class'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
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
