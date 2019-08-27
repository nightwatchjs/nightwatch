const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.elementPresent', function() {
  it('elementPresent assertion passed', function(done) {
    Globals.assertionTest({
      assertionName: 'elementPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            status : 0,
            value : [{
              ELEMENT : '0'
            }]
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'present');
        assert.ok(message.startsWith('Testing if element <.test_element> is present'));
      }
    }, done);
  });

  it('elementPresent assertion passed with selector object', function(done) {
    Globals.assertionTest({
      assertionName: 'elementPresent',
      args: [{selector: '.test_element'}],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            status : 0,
            value : [{
              ELEMENT : '0'
            }]
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'present');
        assert.ok(message.startsWith('Testing if element <.test_element> is present'));
      }
    }, done);
  });

  it('elementPresent assertion passed - with W3C Webdriver', function(done) {
    Globals.assertionTest({
      assertionName: 'elementPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            value:
              [{'element-6066-11e4-a52e-4f735466cecf': 'b8461b6b-7c4b-ac46-8b1a-7071c3b111f1'}]
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, true);
        assert.strictEqual(value, 'present');
        assert.ok(message.startsWith('Testing if element <.test_element> is present'));
      }
    }, done);
  });

  it('elementPresent assertion failed', function(done) {
    Globals.assertionTest({
      assertionName: 'elementPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.strictEqual(selector.selector, '.test_element');
          assert.strictEqual(using, 'css selector');
          callback({
            status : 0,
            value : []
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.strictEqual(passed, false);
        assert.strictEqual(value, 'not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is present'));
      }
    }, done);
  });
});
