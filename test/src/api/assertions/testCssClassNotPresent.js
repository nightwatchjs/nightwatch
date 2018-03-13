const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.cssClassNotPresent', function () {
  it('cssClassNotPresent assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'cssClassNotPresent',
      args: ['.test_element', 'test-css-class'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.equal(cssSelector, '.test_element');
          assert.equal(attribute, 'class');
          callback({
            value: 'other-css-class some-css-class'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'other-css-class some-css-class');
        assert.ok(message.startsWith('Testing if element <.test_element> does not have css class: "test-css-class"'));
      }
    }, done);
  });

  it('cssClassNotPresent assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'cssClassNotPresent',
      args: ['.test_element', 'test-css-class'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          callback({
            value: 'test-css-class other-css-class'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'test-css-class other-css-class');
      }
    }, done);
  });

  it('cssClassNotPresent assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'cssClassNotPresent',
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

