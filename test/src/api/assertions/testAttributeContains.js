const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.attributeContains', function () {

  it('attributeContains assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeContains',
      args: ['.test_element', 'href', 'google', 'Test message'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.equal(cssSelector, '.test_element');
          assert.equal(attribute, 'href');
          callback({
            value: 'http://www.google.com'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.equal(value, 'http://www.google.com');
        assert.ok(message.startsWith('Test message'));
      }
    }, done);
  });

  it('attributeContains assertion passed with selector object', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeContains',
      args: [{
        selector: '.test_element'
      }, 'href', 'google'],
      api: {
        getAttribute(cssSelector, attribute, callback) {
          assert.deepStrictEqual(cssSelector, {selector: '.test_element'});
          callback({
            value: 'http://www.google.com'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.ok(message.startsWith('Testing if attribute href of <.test_element> contains "google"'));
      }
    }, done);
  });

  it('attributeContains assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeContains',
      args: ['.test_element', 'role', 'whatever', 'Test message'],
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

  it('attributeContains assertion not found', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeContains',
      args: ['.test_element', 'role', 'main'],
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
        assert.ok(message.startsWith('Testing if attribute role of <.test_element> contains "main". Element could not be located'));
      }
    }, done);
  });

  it('attributeContains assertion value attribute not found', function (done) {
    Globals.assertionTest({
      assertionName: 'attributeContains',
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
        assert.ok(message.startsWith('Testing if attribute role of <.test_element> contains "main". Element does not have a role attribute'));
      }
    }, done);
  });
});

