const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributeEquals', function () {
  it('attributeEquals assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeEquals',
      args: ['.test_element', 'role', 'main', 'Test message'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.equal(cssSelector, '.test_element');
          assert.equal(attribute, 'role');
          callback({
            value: 'main'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'main');
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
        assert.equal(passed, false);
        assert.equal(value, 'not_expected');
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
        assert.equal(passed, false);
        assert.equal(value, null);
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
        assert.equal(passed, false);
        assert.equal(value, null);
        assert.ok(message.startsWith('Testing if attribute role of <.test_element> equals "main". Element does not have a role attribute'));
      }
    }, done);
  });
});

