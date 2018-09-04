const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('assert.titleContains', function () {
  it('titleContains assertion passed', function (done) {
    Globals.assertionTest({
      assertionName: 'titleContains',
      args: ['Test Title'],
      api: {
        title(callback) {
          callback({
            value: 'Test Title - '
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, true);
        assert.equal(value, 'Test Title - ');
        assert.ok(message.startsWith('Testing if the page title contains "Test Title"'));
      }
    }, done);
  });

  it('titleContains assertion failed without value field in response', function (done) {
    Globals.assertionTest({
      assertionName: 'titleContains',
      args: ['Test Title'],
      api: {
        title(callback) {
          callback({
          });
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.strictEqual(value, '');
      }
    }, done);
  });

  it('titleContains assertion failed with empty response', function (done) {
    Globals.assertionTest({
      assertionName: 'titleContains',
      args: ['Test Title'],
      api: {
        title(callback) {
          callback();
        }
      },
      assertion(passed, value, calleeFn, message) {
        assert.equal(passed, false);
        assert.strictEqual(value, '');
      }
    }, done);
  });

  it('titleContains assertion failed', function (done) {
    Globals.assertionTest({
      assertionName: 'titleContains',
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