const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributeEquals', function () {
  it('attributeEquals assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeEquals',
      args: ['.test_element', 'role', 'main', 'Test message'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.strictEqual(cssSelector, '.test_element');
          assert.strictEqual(attribute, 'role');
          callback({
            value: 'main'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'main');
      }
    }, done);
  });

  it('attributeEquals assertion passed with selector object', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeEquals',
      args: [{selector: '.test_element'}, 'role', 'main'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.deepStrictEqual(cssSelector, {selector: '.test_element'});
          callback({
            value: 'main'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.ok(message.startsWith('Testing if attribute role of <.test_element> equals "main"'));
      }
    }, done);
  });

  it('attributeEquals assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeEquals',
      args: ['.test_element', 'role', 'main', 'Test message'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
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

  it('attributeEquals assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeEquals',
      args: ['.test_element', 'role', 'main', 'Test message'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
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

  it('attributeEquals assertion value attribute not found', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeEquals',
      args: ['.test_element', 'role', 'main'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          callback({
            status: 0,
            value: null
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.strictEqual(value, null);
        assert.ok(message.startsWith('Testing if attribute role of <.test_element> equals "main". Element does not have a role attribute'));
      }
    }, done);
  });
});

