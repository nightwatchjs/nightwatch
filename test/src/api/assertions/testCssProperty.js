const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.cssProperty', function () {
  it('cssProperty assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'cssProperty',
      args: ['.test_element', 'display', 'none'],
      api: {
        getCssProperty(cssSelector, property, callback) {
          assert.equal(cssSelector, '.test_element');
          assert.equal(property, 'display');
          callback({
            value: 'none'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'none');
        assert.ok(message.startsWith('Testing if element <.test_element> has css property "display: none"'));
      }
    }, done);
  });

  it('cssProperty assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'cssProperty',
      args: ['.test_element', 'display', 'none'],
      api: {
        getCssProperty(cssSelector, property, callback) {
          assert.equal(cssSelector, '.test_element');
          assert.equal(property, 'display');
          callback({
            value: 'block'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'block');
      }
    }, done);
  });

  it('cssProperty assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'cssProperty',
      args: ['.test_element', 'display', 'none'],
      api: {
        getCssProperty(cssSelector, property, callback) {
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, null);
        assert.ok(message.startsWith('Testing if element <.test_element> has css property display. Element or attribute could not be located'));
      }
    }, done);
  });
});

