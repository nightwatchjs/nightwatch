const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.property', function () {
  it('property assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'property',
      args: ['.test_element', 'display', 'none'],
      api: {
        getProperty(cssSelector, property, callback) {
          assert.strictEqual(cssSelector, '.test_element');
          assert.strictEqual(property, 'display');
          callback({
            value: 'none'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'none');
        assert.ok(message.startsWith('Testing if element <.test_element> has property "display: none"'));
      }
    }, done);
  });
    
  it('property assertion passed with selector object', function (done) {
    Globals.assertionTest({
      assertionName: 'property',
      args: [{selector: '.test_element'}, 'display', 'none'],
      api: {
        getProperty(cssSelector, property, callback) {
          assert.deepStrictEqual(cssSelector, {selector: '.test_element'});
          callback({
            value: 'none'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'none');
        assert.ok(message.startsWith('Testing if element <.test_element> has property "display: none"'));
      }
    }, done);
  });

  it('property assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'property',
      args: ['.test_element', 'display', 'none'],
      api: {
        getProperty(cssSelector, property, callback) {
          assert.strictEqual(cssSelector, '.test_element');
          assert.strictEqual(property, 'display');
          callback({
            value: 'block'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.strictEqual(value, 'block');
      }
    }, done);
  });

  it('property assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'property',
      args: ['.test_element', 'display', 'none'],
      api: {
        getProperty(cssSelector, property, callback) {
          callback({
            status: -1
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.strictEqual(value, null);
        assert.ok(message.startsWith('Testing if element <.test_element> has property display. Element or attribute could not be located'));
      }
    }, done);
  });
  
});

