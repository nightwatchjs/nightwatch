const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.title', function () {
  it('title assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'title',
      args: ['Test Title'],
      api: {
        title(callback) {
          callback({
            value: 'Test Title'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'Test Title');
        assert.ok(message.startsWith('Testing if the page title equals "Test Title"'));
      }
    }, done);
  });

  it('title assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'title',
      args: ['Test Title'],
      api: {
        title(callback) {
          callback({
            value: 'Wrong Title'
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.equal(value, 'Wrong Title');
      }
    }, done);
  });
});

