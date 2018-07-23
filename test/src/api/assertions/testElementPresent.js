const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.elementPresent', function() {
  it('elementPresent assertion passed', function(done) {
    Globals.assertionTest({
      assertionName: 'elementPresent',
      args: ['.test_element'],
      api: {
        elements(using, selector, callback) {
          assert.equal(selector, '.test_element');
          assert.equal(using, 'css selector');
          callback({
            status : 0,
            value : [{
              ELEMENT : '0'
            }]
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'present');
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
          assert.equal(selector, '.test_element');
          assert.equal(using, 'css selector');
          callback({
            status : 0,
            value : []
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'not present');
        assert.ok(message.startsWith('Testing if element <.test_element> is present'));
      }
    }, done);
  });
});