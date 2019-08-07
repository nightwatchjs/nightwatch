const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.elementNotPresent', function () {
  it('elementNotPresent assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'elementNotPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            status: 0,
            value: []
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is not present'));
      }
    }, done);
  });

  it('elementNotPresent assertion passed with selector object', function (done) {
    Globals.assertionTest({
      assertionName: 'elementNotPresent',
      args: [{selector: '.test_element'}],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');

          callback({
            status: 0,
            value: []
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is not present'));
      }
    }, done);
  });

  it('elementPresent assertion passed - with W3C Webdriver', function(done) {
    Globals.assertionTest({
      assertionName: 'elementNotPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            value: []
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is not present'));
      }
    }, done);
  });

  it('elementNotPresent assertion passed when exceptions are passed', function (done) {
    Globals.assertionTest({
      assertionName: 'elementNotPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            status: -1,
            value: null
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is not present'));
      }
    }, done);
  });

  it('elementNotPresent assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'elementNotPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            status: 0,
            value: [{
              ELEMENT: '0'
            }]
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.strictEqual(value, 'present');
      }
    }, done);
  });
});
